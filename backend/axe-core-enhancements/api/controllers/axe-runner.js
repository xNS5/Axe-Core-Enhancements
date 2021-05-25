const { AxePuppeteer } = require ('@axe-core/puppeteer');
const puppeteer = require ('puppeteer');


const url_list = ['https://www.primebellingham.com'];

class AxeRunner {
  run(url_list) {
    (async () => {
      //note: make sure to run node_modules/puppeteer/install.js to get both firefox and chrome switching available
      const browser = await puppeteer.launch({product: 'firefox',headless:true});
      const violations = (await Promise.allSettled(
        [...Array(url_list.length)].map(async(_,i) => {
          const page = await browser.newPage();
          await page.goto(url_list[i]);
          const results = await new AxePuppeteer(page).analyze();
          // const axe = new AxeResult();

          for(let j = 0; j < results.violations.length; j++){
            console.log(results.violations[j]);
          }
        })
      )).filter(e => e.status === "fulfilled")
        .map(e => e.value);
      console.log(violations);
      await browser.close();
    })();
  }
}


const runner = new AxeRunner();
runner.run(url_list);

