# Web scraping using puppeteer + chrome-launcher
Trying to eliminate puppeteer default behaviour where it launches chromium instance and never actually kill, it even after calling `browser.close()` (CMIIW), resulting in zombie process.
This project uses chrome-stable-browser as headless browser along with chrome-launcher as control. Chrome-launcher allow node.js to spin up chrome instance and kill it manually, or automatically when process exits

## How to run
build the image using the `Dockerfile` or just run `node index`
