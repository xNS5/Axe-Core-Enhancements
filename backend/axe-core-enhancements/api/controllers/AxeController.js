/**
 * AxeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

/*
* Axe Runner
* Author: Michael Kennedy
* Description: Driver function for the Axe-Core accessibility testing engine.
* Parameters: name, tags, urlList.
* Name: name of the browser to be used (either firefox, or chrome)
* Tags: wcag success criteria
* urlList: list of 1...* URLs to parse
*
* This application utilizes axe-core/puppeteer to run axe-core on the listed URLs.
* Upon testing, the results from headless and non-headless puppeteer were the same, whereas headless selenium vs non-headless
* yielded slightly different results.
*
* At this point in time, this only can use Firefox and Chrome. It's possible for puppeteer to use Microsoft Edge
* however it will need to be installed post-deployment, most likely in a later release.
* */

const AxeBuilder = require('@axe-core/webdriverjs');
const WebDriver = require('selenium-webdriver');
const {getCriterionByLevel} = require('wcag-reference-cjs');
require('chromedriver');
require('geckodriver');
const { AceResult } = require('../models/aceResult.js');
const CreateCSV = require('../../lib/files/create-csv.js');
const {AxeResults} = require('axe-core');


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
    let tag1, tag2;
    let wcag_regex = new RegExp('^[a]{1,3}$')

    //@TODO Remove tag1 and tag2
    if (wcagLevel.length === 0 || wcagLevel.length === 2) {
      tag1 = wcagLevel[0];
      tag2 = wcagLevel[1];
    } else {
      tag1 = wcagLevel[0];
    }

    for (let i = 0; i < criteria.length; i++) {
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

    console.log(tags);

    const results = (await Promise.allSettled(
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
          return await new Promise(((resolve, reject) => {
            driver.get(urlList[i].url).then(() => {
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
          }));
        } catch(e) {
          req.send(this.exits.error, {e});
        }
      }))).filter(e => e.status === "fulfilled").map(e => e.value);
    if(is3A){
      const data = getCriterionByLevel((wcagLevel.length === 2 ? '2.0' : '2.1'), 3);
      for(let i = 0; i < results.length; i++){
        for(let j = 0; j < data.length; j++){
          results[i].incomplete.push({
            description:data[i].id,
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
            tags:['wcag2aaa', 'wcag' + data[j].num.replaceAll('.','')],
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
      req.send({error: "There was a problem with Axe"});
    } else {
      req.send(new CreateCSV(ace_result));
    }
  }
};

