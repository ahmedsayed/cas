const puppeteer = require('puppeteer');
const assert = require('assert');
const cas = require('../../cas.js');

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await browser.newPage();
    await page.goto("https://localhost:8443/cas/login");

    await page.waitForTimeout(2000)

    let link = await cas.textContent(page, "#forgotPasswordLink");
    assert(link === "Reset your password")

    await cas.click(page, "#forgotPasswordLink")
    await page.waitForTimeout(1000)

    let header = await cas.textContent(page, "#reset #fm1 h3");

    assert(header === "Reset your password")

    await cas.assertVisibility(page, '#username')
    let uid = await page.$('#username');
    assert("none" === await uid.evaluate(el => el.getAttribute("autocapitalize")))
    assert("false" === await uid.evaluate(el => el.getAttribute("spellcheck")))
    assert("username" === await uid.evaluate(el => el.getAttribute("autocomplete")))

    await page.type('#username', "casuser");
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    await page.waitForTimeout(1000)

    header = await cas.textContent(page, "#content h2");
    assert(header === "Password Reset Instructions Sent Successfully.")

    header = await cas.textContent(page, "#content p");
    assert(header.startsWith("You should shortly receive a message"))

    await page.goto("http://localhost:8282");
    await page.waitForTimeout(1000)
    await cas.click(page, "table tbody td a")
    await page.waitForTimeout(1000)

    link = await cas.textContent(page, "div[name=bodyPlainText] .well");
    await page.goto(link);
    await page.waitForTimeout(1000)

    header = await cas.textContent(page, "#content h2");
    assert(header === "Answer Security Questions")

    await page.type('#q0', "answer1");
    await page.type('#q1', "answer2");
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
    await page.waitForTimeout(1000)

    await typePassword(page, "EaP8R&iX$eK4nb8eAI", "EaP8R&iX$eK4nb8eAI")
    await page.waitForTimeout(1000)
    await cas.assertInvisibility(page, '#password-confirm-mismatch-msg');
    await cas.assertInvisibility(page, '#password-policy-violation-msg');

    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    header = await cas.textContent(page, "#content h2");
    assert(header === "Password Change Successful")

    header = await cas.textContent(page, "#content p");
    assert(header === "Your account password is successfully updated.")

    await browser.close();
})();


async function typePassword(page, pswd, confirm) {
    await page.$eval('#password', el => el.value = '');
    await page.type('#password', pswd);

    await page.$eval('#confirmedPassword', el => el.value = '');
    await page.type('#confirmedPassword', confirm);
}
