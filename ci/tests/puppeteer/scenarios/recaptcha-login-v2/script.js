const puppeteer = require('puppeteer');
const assert = require('assert');
const cas = require('../../cas.js');

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await browser.newPage();
    await page.goto("https://localhost:8443/cas/login");
    // await page.waitForTimeout(10000)

    await cas.assertVisibility(page, '#recaptchaV2Section')

    await cas.assertVisibility(page, '#g-recaptcha')

    await browser.close();
})();
