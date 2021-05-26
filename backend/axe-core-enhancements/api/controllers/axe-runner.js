const { AxePuppeteer } = require ('@axe-core/puppeteer');
const puppeteer = require ('puppeteer');
const {AceResult} = require('../models/axe-result.js');

/*
* Limitations:
* HTML elements can't have sandbox tag enabled. -- may submit
* */

class AxeRunner {

  run(url_list) {
    function resolveAfter2Seconds() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, 2000);
      });
    }

    let results = [];
    (async () => {
      /*
        note: make sure to run node_modules/puppeteer/install.js to get both firefox and chrome switching available
        Using the await Promise.allSettled(...) allows for testing multiple links at a time.
      */
      const browser = await puppeteer.launch({product: 'firefox', headless:false});
      results = (await Promise.allSettled(
        [...Array(url_list.length)].map(async(_,i) => {
          let results = [];
          const page = await browser.newPage();
          await page.goto(url_list[i]);
          results = await new AxePuppeteer(page).disableFrame('sandbox').analyze().catch(err => {
            if(err){
              console.log("AxeRunner - Analysis Error: " + err.message);
            }
          });
          return ((results.length === 0) ? [url_list[i], null] : results);
        })
      )).filter(e => e.status === "fulfilled").map(e => e.value);
      await browser.close();
      let ace_result = [];
      for(let i = 0; i < results.length; i++) {
        ace_result.push( new AceResult(results[i].testEngine.name, results[i]));
      }
      console.log(ace_result);

    })();
  }
}

exports.AxeRunner = AxeRunner;

