const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

  // Create a browser instance
  const browser = await puppeteer.launch({
    headless: 'new',
    // `headless: true` (default) enables old Headless;
    // `headless: 'new'` enables new Headless;
    // `headless: false` enables “headful” mode.
    args: ['--disable-dev-shm-usage']
  });

  // Create a new page
  const page = await browser.newPage();

  // Get HTML content from HTML file
  // TODO: HTML sent from API invoke to the API service running on node.js?
  const html = fs.readFileSync('sample.html', 'utf-8');
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // To reflect CSS used for screens instead of print
  // TODO: will it work when running on AKS / using alpine base image.
  //       reference: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-on-alpine
  await page.emulateMediaType('screen');

  // Download the PDF
  // TODO: PDF Transfered as API reponse on base64 format
  const pdf = await page.pdf({
    path: 'result.pdf',
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });

  // Close the browser instance
  await browser.close();
})();