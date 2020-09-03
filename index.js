const puppeteer = require('puppeteer-core');
const chromeLauncher = require('chrome-launcher');
const axios = require('axios');

(async () => {
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    })

    const response = await axios.get(`http://localhost:${chrome.port}/json/version`)
    const { webSocketDebuggerUrl } = response.data;
    const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl })
    
    const page = await browser.newPage();
    await page.goto('https://developers.google.com/web/');

    const searchBoxSelector = 'form.devsite-search-form input';
    await page.waitForSelector(searchBoxSelector)
    await page.type(searchBoxSelector, 'Headless Chrome');

    const allResultSelector = '.devsite-suggest-all-results';
    await page.waitForSelector(allResultSelector);
    await page.click(allResultSelector);

    const resultsSelector = '.gsc-results .gsc-thumbnail-inside a.gs-title';
    await page.waitForSelector(resultsSelector);
    
    const links = await page.evaluate((resultsSelector) => {
        const anchors = Array.from(document.querySelectorAll(resultsSelector));
        return anchors.map((anchor) => {
        const title = anchor.textContent.split('|')[0].trim();
        return `${title} - ${anchor.href}`;
        });
    }, resultsSelector);

    console.log(links.join('\n'));

    await browser.close();
    await chrome.kill()
})()
.catch(err => console.log({err}))