const { AxePuppeteer } = require ('@axe-core/puppeteer');
const puppeteer = require ('puppeteer');

(async () => {
  const browser = await puppeteer.launch({product: 'firefox', headless: true});
  const page = await browser.newPage();
  await page.goto('https://primebellingham.com');
  const results = await new AxePuppeteer(page).analyze();
  console.log(results.violations);
  await page.close();
  await browser.close();
})();
