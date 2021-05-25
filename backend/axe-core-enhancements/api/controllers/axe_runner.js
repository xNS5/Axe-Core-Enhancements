const { AxePuppeteer } = require ('@axe-core/puppeteer');
const puppeteer = require ('puppeteer');

const url_list = ['https://www.primebellingham.com', 'https://www.reddit.com'];

class axe_runner{
  run(url_list) {
    (async () => {
      //note: make sure to run node_modules/puppeteer/install.js to get both firefox and chrome switching available
      const browser = await puppeteer.launch({product: 'firefox',headless:false});
      const page = await browser.newPage();
      await page.goto(url_list[0]);
      const results = await new AxePuppeteer(page).analyze();
      console.log(results.violations);
      await page.close();
      await browser.close();
    })();
  }
}

const runner = new axe_runner();

runner.run(url_list);

