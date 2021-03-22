const puppeteer = require('puppeteer');
const targetUrl = process.env.MYCHSA_E2E_TARGET;

(async () => {

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: "networkidle2" });

  let content = await page.content();

  console.log(content);

  await browser.close();


})();