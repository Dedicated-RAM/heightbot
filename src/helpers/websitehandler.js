//const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const adblocker = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs');
const path = require('path');
console.log("running");

// Add the adblocker plugin to Puppeteer


puppeteer.use(adblocker());

const doSomePuppeteerThings = async (user, localStore) => {
    const url = 'https://www.heightcomparison.com/'; // Change this to the website you want to take a screenshot of
    const browser = await puppeteer.launch();
    const localStorage = { person_infos: localStore };

    await setDomainLocalStorage(browser, url, localStorage);

    const page = await browser.newPage();

    // Navigate to the website you want to take a screenshot of
    await page.goto(url);

    // Wait for the page to fully load
    //await page.waitForLoadState('networkidle2');

    // Get the bounding box of the div element to screenshot
    const divSelector = '#right-component-small';
    const element = await page.$(divSelector);
    console.log(element);
    const box = await element.boundingBox();

    const filename = user + '.png';

    const cacheFolderPath = 'image_cache';

    if (!fs.existsSync(cacheFolderPath)) {
    fs.mkdirSync(cacheFolderPath);
    console.log('Image cache folder created successfully!');
    } else {
    console.log('Image cache folder already exists!');
    }

    // Take a screenshot of the div element
    await page.screenshot({
        path: cacheFolderPath + "/" + filename,
        clip: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height
        }
    });
    console.log("screenshot taken!");

    await browser.close();
    return (cacheFolderPath + "/" + filename);
};

const setDomainLocalStorage = async (browser, url, values) => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', r => {
    r.respond({
      status: 200,
      contentType: 'text/plain',
      body: 'tweak me.',
    });
  });
  await page.goto(url);
  await page.evaluate(values => {
    for (const key in values) {
      localStorage.setItem(key, JSON.stringify(values[key]));
    }
  }, values);
  await page.close();
};






module.exports = {
    getImage : async (user, localStore) => {

        const filepath = doSomePuppeteerThings(user, localStore);
        return filepath;
        
    }
}

