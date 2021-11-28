/**
 * AxeController
 * @author Michael Kennedy
 * @description :: Server-side actions for handling Axe scans
 * @help        :: See https://github.com/xNS5/Axe-Core-Enhancements/issues
 * @param engine: A string denoting which accessibility engine to use. Currently only supports Deque Labs' Axe
 * @param browser: A string denoting which browser to use for the scan
 * @param a3: A specific check indicating whether or not Level 3 (AAA) checks should be added to the result object.
 * @param wcagLevel: A JSON object indicating which WCAG version to use
 * @param criteria: Other criterion (Best Practices, Section508)
 * @param windowSizes: A JSON object containing booleans, indicating which screen size to test for (mobile, tablet, desktop)
 * @param urls: A list of URLs to be scanned
 */

require('chromedriver');
require('geckodriver');
const AxeBuilder = require('@axe-core/webdriverjs');
const WebDriver = require('selenium-webdriver');
const { AceResult } = require('../models/aceResult.js');
const CreateCSV = require('../../lib/files/create-csv.js');
const {getCriterionByLevel} = require('wcag-reference-cjs');


module.exports = {
  friendlyName: 'axe-runner',
  description: 'Runs the Deque labs Accessibility testing engine',

  inputs: {
    engine: {
      type: 'string',
      required: true
    },
    browser: {
      type: 'string',
      required: true
    },
    a3: {
      type: 'boolean',
      required: true
    },
    mobile: {
      type: 'boolean',
      required: false
    },
    tablet: {
      type: 'boolean',
      required: false
    },
    desktop: {
      type: 'boolean',
      required: false
    },
    custom: {
      type: 'json',
      required: false
    },
    wcagLevel: {
      type: 'json',
      required: false,
    },
    criteria: {
      type: 'json',
      required: false,
    },
    resolutions:{
      type:'json',
      required:false,
    },
    urls: {
      type: 'json',
      required: true,
    }
  },
  exits: {
    success: {
      statusCode: 201,
      description: 'Successfully checked website(s).'
    },
    error: {
      statusCode: 400,
      description: 'Invalid Input.'
    }
  },

  runAxe: async function (inputs, req) {
    inputs = inputs.body;
    const name = inputs.browser;
    const wcagLevel = inputs.wcagLevel;
    const criteria = inputs.criteria;
    const urlList = inputs.urls;
    const is3A = inputs.a3;
    const resolutions = inputs.resolution;
    const tags = [];
    let tag1, tag2;
    let wcag_regex = new RegExp('^[a]{1,3}$')

    // https://www.hobo-web.co.uk/best-screen-size/#chartHeaderTitle
    const windows = {
      "desktop": [1600,900],
      "tablet":[962,601],
      "mobile":[360,780]
    }

    //@TODO Remove tag1 and tag2
    if (wcagLevel.length === 0 || wcagLevel.length === 2) {
      tag1 = wcagLevel[0];
      tag2 = wcagLevel[1];
    } else {
      tag1 = wcagLevel[0];
    }

    for (let i = 0; i < criteria.length; i++){
      if (wcag_regex.test(criteria[i])){
        if (tag1) {
          tags.push(tag1+criteria[i]);
        } if(tag2){
          tags.push(tag2+criteria[i]);
        }
      } else {
        tags.push(criteria[i]);
      }
    }

    let options, browser;
    switch(name){
      case 'chrome':
        options = WebDriver.Capabilities.chrome();
        browser = WebDriver.Browser.CHROME;
        break;
      case 'firefox':
        options = WebDriver.Capabilities.firefox();
        browser = WebDriver.Browser.FIREFOX;
        break;
      /*case 'msedge':
        options = WebDriver.Capabilities.edge();
        browser = WebDriver.Browser.EDGE;
        break;*/
    }

    const results = (await Promise.allSettled(
      [...Array(resolutions.length)].map(async (_, j) => {
        return await new Promise((resolve, reject) => {
          [...Array(urlList.length)].map(async (_, i) => {
            try{
              options.setAcceptInsecureCerts(true);
              const driver = await new WebDriver.Builder().withCapabilities(options).forBrowser(browser).build();
              let builder = (tags.length === 0) ? (new AxeBuilder(driver)) : (new AxeBuilder(driver).withTags(tags));
              driver.get(urlList[i].url).then(() => {
                let title;
                driver.manage().window().setRect({width: windows[resolutions[j]][0], height: windows[resolutions[j]][1], x:0, y:0,}).then(() => {
                  driver.getTitle().then((res) => {
                    title = res;
                  })
                  builder.analyze((err, results) => {
                    driver.quit();
                    if (err) {
                      console.log(err);
                      reject(err);
                    } else {
                      results.pageTitle = title;
                      resolve(results);
                    }
                  });
                })
              })
            } catch (e){
              sails.log(e);
              req.status(500).send(e.toString());
            }
          })
        })
      })
    )).filter(e => e.status === "fulfilled" && (e.value !== undefined && e.value !== null)).map(e => e.value);
    if(is3A){
      const data = getCriterionByLevel((wcagLevel.length === 2 ? '2.1' : '2.0'), 3);
      for(let i = 0; i < results.length; i++){
        for(let j = 0; j < data.length; j++){
          results[i].incomplete.push({
            description:data[j].id,
            help:data[j].description,
            helpUrl: data[j].detailedReference,
            id: data[j].id,
            impact:'',
            nodes:[{
              all: [],
              any: [],
              failureSummary:'',
              html:'<body></body>',
              impact:'',
              none:[],
              target:[],
            }],
            tags:['wcag' + data[j].num.replaceAll('.','')],
          });
        }
      }
    }

   let ace_result = [];
    for (let i = 0; i < results.length; i++) {
      try {
        ace_result[i] = new AceResult(results[i].testEngine.name, results[i]);
      } catch (err) {
        console.log(`AxeRunner: Error adding to AceResult array: ${err.toString()}`);
      }
    }
    if(ace_result.length === 0){
      req.status(500).json({error: "There was a problem with the Axe Controller"});
    } else {
      req.status(200).send(new CreateCSV(ace_result));
    }
  }
};

