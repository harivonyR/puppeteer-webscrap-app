const puppeteer = require('puppeteer')
const sleep = require('./helper')
const logger = require('heroku-logger')
const fs = require('fs')

async function login (browser){
    console.log('[👍] login browser ');

    const loginPage = await browser.newPage();
    console.log('[👍] login page is openning ');

    await loginPage.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')
    console.log('[👍] login page opened !');

    //await sleep(4000)
    await loginPage.waitForSelector('#userName')
    await loginPage.type('#userName','SENMAU62',{delai:50});
    //await sleep(3000)
    await loginPage.waitForSelector('#userPassword')
    await loginPage.type('#userPassword','M3rckx',{delai:50});
    await loginPage.keyboard.press('Enter');
    sleep(5000)
    console.log('[👍] Login Done ! ');
    
    try{
        fs.unlinkSync(`./public/assets/login.png`);
      }catch(e){
        console.log(e)
      }

    await loginPage.screenshot({ path: './public/assets/login.png'});
}

module.exports = login;