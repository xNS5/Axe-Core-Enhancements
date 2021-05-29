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


const  {AxePuppeteer} = require ('@axe-core/puppeteer');
const puppeteer = require ('puppeteer');
const AxeBuilder = require('@axe-core/webdriverjs');
const WebDriver = require('selenium-webdriver');
const chrome_driver = require('chromedriver');
const  {AceResult} = require('../models/axe-result.js');



class AxeRunner {
  run(name, tags, url_list) {
    const config = {
      product: name,
      headless: true,
    }
    let results = [];
    (async () => {
      const browser = await puppeteer.launch({config});
      results = (await Promise.allSettled(
        [...Array(url_list.length)].map(async(_,i) => {
          let inner_results = [];
          const page = await browser.newPage();
          await page.setBypassCSP(true);
          await page.goto(url_list[i], {
            waitUntil: ['load', 'domcontentloaded'],
          });

          /*
          * Deleting iframes with sandbox attributes. In some cases, such as when running Axe-Core/puppeteer
          * on https://haikyuu.org/manga/haikyuu/chapter-378/, there are a few iframes with sandboxes
          * where js code can't be injected to test accessibility. In order to eliminate those errors,
          * the iframe is simply deleted. Based on my research it has no effect on accessibility.
          * */

          let iframe_var = await page.$x("//iframe[contains(.,sandbox)]");
          if(iframe_var.length > 0){
            for(let iframe of iframe_var){
              await page.evaluate(el => el.remove(), iframe).catch(err =>{
                if(err){
                  console.log(`AxeRunner: Error removing iframe with sandbox attribute: ${err.toString()}`);
                }
              });
            }
          }

          // Returns a new promise
          let axe_puppeteer = await new AxePuppeteer(page);

          //if the user selected tags to use, it runs the .withTags() function, otherwise it doesn't.
          if(tags.length > 1){
            axe_puppeteer = axe_puppeteer.withTags(tags);
          }
          inner_results = axe_puppeteer.analyze().catch(err => {
            if(err){
              console.log(`AxeRunner: Error running Axe-Core on URL: ${url_list[i]}: ${err.toString()} `);
            }
          });

          return ((inner_results.length === 0) ? null : inner_results);
        })
      )).filter(e => e.status === "fulfilled").map(e => e.value);
      await browser.close();
      let ace_result = [];
      for(let i = 0; i < results.length; i++) {
        try{
          ace_result.push(new AceResult(results[i].testEngine.name, results[i]));
        }catch(err) {
          console.log(`AxeRunner: Error adding to AceResult array: ${err.toString()}`);
        }
      }
      return ace_result;
    })();

  }
}

exports.AxeRunner = AxeRunner;

const t = new AxeRunner;
t.run('firefox',['wcag2a'],['https://www.w3.org/WAI/demos/bad/before/home.html']);

