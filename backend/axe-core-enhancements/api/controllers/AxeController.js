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

const AxeBuilder = require('@axe-core/webdriverjs');
const WebDriver = require('selenium-webdriver');
require('chromedriver');
require('geckodriver');
const { AceResult } = require('../models/aceResult.js');
const { FirefoxProfile } = require('firefox-profile');
const CreateCSV = require('../../lib/files/create-csv.js');


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
    wcagLevel: {
      type: 'json',
      required: false,
    },
    criteria: {
      type: 'json',
      required: false,
    },
    windowSizes:{
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
    const tags = [];
    const windowSizes = inputs.windowSizes;
    let screenSizes = [[360,640],[601,962],[1024,768]];
    let tag1, tag2;
    let wcag_regex = new RegExp('^[a]{1,3}$')
    console.log(inputs)


    //@TODO Remove tag1 and tag2
    if (wcagLevel.length === 0 || wcagLevel.length === 2) {
      tag1 = wcagLevel[0];
      tag2 = wcagLevel[1];
    } else {
      tag1 = wcagLevel[0];
    }

    for (let i = 0; i < criteria.length; i++) {
      if (wcag_regex.test(criteria[i])){
        //@TODO use .map() to create 2a or 2aa depending on what it is
        if (tag1) {
          tags.push(tag1+criteria[i]);
        } if(tag2){
          tags.push(tag2+criteria[i]);
        }
      } else {
        tags.push(criteria[i]);
      }
    }

    // const tags = wcagLevel.flatMap(wcag => criteria.map(crit => {
    //   if(wcag_regex.test(crit)){
    //     return wcag + crit;
    //   }
    // }))

    console.log(tags);

    const results = (await Promise.allSettled(
      [...Array(windowSizes.filter((x) => {return x;}).length)].map(async (_, j) => {
        return await new Promise((resolve, reject) => {
          [...Array(urlList.length)].map(async (_, i) => {
            try{
              let options;
              if(name === 'chrome'){
                options = WebDriver.Capabilities.chrome();
              } else {
                options = WebDriver.Capabilities.firefox();
              }
              options.setAcceptInsecureCerts(true);
              const driver = await new WebDriver.Builder().withCapabilities(options).forBrowser(`${name}`).build();
              let builder = (tags.length === 0) ? (new AxeBuilder(driver)) : (new AxeBuilder(driver).withTags(tags));
              driver.get(urlList[i].url).then(() => {
                driver.manage().window().setRect({width: screenSizes[j][0], height: screenSizes[j][1], x:0, y:0,}).then(() => {
                  builder.analyze((err, results) => {
                    driver.quit();
                    if (err) {
                      console.log(err);
                      reject(err);
                    } else {
                      resolve(results);
                    }
                  });
                })
              })
            } catch (e){
              req.send(e);
            }
          })
        })
      })
    )).filter(e => e.status === "fulfilled").map(e => e.value);
   let ace_result = [];
    for (let i = 0; i < results.length; i++) {
      try {
        ace_result[i] = new AceResult(results[i].testEngine.name, results[i]);``
      } catch (err) {
        console.log(`AxeRunner: Error adding to AceResult array: ${err.toString()}`);
      }
    }
    if(ace_result.length === 0){
      req.status(500).json({error: "There was a problem with Axe"});
    } else {
      req.send(new CreateCSV(ace_result));
    }
  }
};

