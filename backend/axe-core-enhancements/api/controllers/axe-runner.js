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

          let axe_puppeteer = await new AxePuppeteer(page);
          if(tags.length > 0){
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
      console.log(ace_result);
    })();

  }
}

exports.AxeRunner = AxeRunner;

const t = new AxeRunner;
t.run('chrome','',['https://haikyuu.org/manga/haikyuu/chapter-378/']);

