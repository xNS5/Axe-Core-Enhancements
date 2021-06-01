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
* Parameters: name, tags, url_list.
* Name: name of the browser to be used (either firefox, or chome)
* Tags: wcag success criteria
* Url_list: list of 1...* URLs to parse
*
* This application utilizes axe-core/puppeteer to run axe-core on the listed URLs.
* Upon testing, the results from headless and non-headless puppeteer were the same, whereas headless selenium vs non-headless
* yielded slightly different results.
*
* At this point in time, this only can use Firefox and Chrome. It's possible for puppeteer to use Microsoft Edge
* however it will need to be installed post-deployment, most likely in a later release.
* */


const {AxePuppeteer} = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const AxeBuilder = require('@axe-core/webdriverjs');
const WebDriver = require('selenium-webdriver');
const chrome_driver = require('chromedriver');
const {AceResult} = require('../models/aceResult.js');

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
      description: "Successfully checked website(s)."
    },
    error: {
      description: "Oops! Something went wrong."
    }
  },

  runAxe: async function (inputs) {
    inputs = inputs.body;
    const name = inputs.browser;
    const wcagLevel = inputs.wcagLevel;
    const criteria = inputs.criteria;
    const url_list = inputs.urls;
    const tags = [];
    let results = [];
    let tag1 = '';
    let tag2 = '';
    let wcag_regex = new RegExp('^[a]{1,3}$')

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


    const browser = await puppeteer.launch({product: name, headless: true});
    results = (await Promise.allSettled(
      [...Array(url_list.length)].map(async (_, i) => {
        let inner_results;
        const page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto(url_list[i].url, {
          waitUntil: ['load', 'domcontentloaded'],
        });

        /*
        * Deleting iframes with sandbox attributes. In some cases, such as when running Axe-Core/puppeteer
        * on https://haikyuu.org/manga/haikyuu/chapter-378/, there are a few iframes with sandboxes
        * where js code can't be injected to test accessibility. In order to eliminate those errors,
        * the iframe is simply deleted. Based on my research it has no effect on accessibility.
        * */

        // let iframe_var = await page.$x("//iframe[contains(.,sandbox),contains(.,_url: 'about:blank')]");
        // console.log(iframe_var.length);
        // if (iframe_var.length > 0) {
        //   for (let iframe of iframe_var) {
        //     await page.evaluate(el => el.remove(), iframe).catch(err => {
        //       if (err) {
        //         console.log(`AxeRunner: Error removing iframe with sandbox attribute: ${err.toString()}`);
        //       }
        //     });
        //   }
        // }

        // Disables iFrames. Puppeteer has an intermittent issue with iFrames to the point where
        //it was affecting result output, so until that's resolved they should be disabled for the time being.
        let axe_puppeteer = await new AxePuppeteer(page).disableFrame("*");

        //if the user selected tags to use, it runs the .withTags() function, otherwise it doesn't.
        if (tags.length > 1) {
          axe_puppeteer = axe_puppeteer.withTags(tags);
        }
        inner_results = axe_puppeteer.analyze().catch(err => {
          if (err) {
            console.log(`AxeRunner: Error running Axe-Core on URL: ${url_list[i]}: ${err.toString()} `);
          }
        });

        return ((inner_results.length === 0) ? null : inner_results);
      })
    )).filter(e => e.status === "fulfilled").map(e => e.value);
    await browser.close();
    console.log(results);
    const ace_result = [];
    for (let i = 0; i < results.length; i++) {
      try {
        ace_result.push(new AceResult(results[i].testEngine.name, results[i]));
      } catch (err) {
        console.log(`AxeRunner: Error adding to AceResult array: ${err.toString()}`);
      }
    }
    return;
  }
};

