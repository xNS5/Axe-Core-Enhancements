const  {AxePuppeteer} = require ('@axe-core/puppeteer');
const puppeteer = require ('puppeteer');
const AxeBuilder = require('@axe-core/webdriverjs');
const WebDriver = require('selenium-webdriver');
const chrome_driver = require('chromedriver');
const edge_driver = require('edgedriver');
const  {AceResult} = require('../models/axe-result.js');

/*
* Limitations:
* HTML elements can't have sandbox tag enabled. -- may create an issue with @axe-core/puppeteer team.
* note: make sure to run node_modules/puppeteer/install.js to get both firefox and chrome switching available
* Using the await Promise.allSettled(...) allows for testing multiple links at a time.
* */

class AxeRunner {
  run(name, tags, url_list) {
    const config = {
      product: name,
      headless: true,
      args:[]
    }
    let results = [];
    (async () => {
      const browser = await puppeteer.launch({config});
      results = (await Promise.allSettled(
        [...Array(url_list.length)].map(async(_,i) => {
          const page = await browser.newPage();
          await page.setBypassCSP(true);
          await page.goto(url_list[i], {
            waitUntil: ['load', 'domcontentloaded'],
          });
          results = await new AxePuppeteer(page).analyze().catch(err => {
            if(err){
              console.log("AxeRunner - Analysis Error: " + err.message);
            }
          });
          return ((results.length === 0) ? null : results);
        })
      )).filter(e => e.status === "fulfilled").map(e => e.value);
      await browser.close();
      let ace_result = [];
      for(let i = 0; i < results.length; i++) {
        ace_result.push(new AceResult(results[i].testEngine.name, results[i]));
      }
      console.log(ace_result);
    })();

  }
}

exports.AxeRunner = AxeRunner;

const t = new AxeRunner;
t.run('firefox',[],['https://haikyuu.org/manga/haikyuu/chapter-378/']);

