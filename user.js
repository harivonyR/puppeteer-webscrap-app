const puppeteer = require('puppeteer');
const sleep = require('./helper')

async function login (browser){
    console.log('[👍] login browser ');

    const loginPage = await browser.newPage();
    console.log('[👍] login page is openning ');

    await loginPage.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')
    console.log('[👍] login page opened ');

    await sleep(4000)
    //await loginPage.waitForSelector('#userName')
    await loginPage.type('#userName','SENMAU62',{delai:100});
    await sleep(3000)
    //await loginPage.waitForSelector('#userPassword')
    await loginPage.type('#userPassword','M3rckx',{delai:100});
    await loginPage.keyboard.press('Enter');
    
    console.log('[👍] Login Done ! ');
}

module.exports = login;