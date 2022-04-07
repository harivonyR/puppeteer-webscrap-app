const puppeteer = require('puppeteer')
const sleep = require('./helper')
const fs = require('fs')

async function needLogin(page){
    ext-gen28
}

async function login(page){
    console.log('[👍] login browser ');

    //const page = await browser.newPage();
    console.log('[👍] login page is openning ');

    await page.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')
    console.log('[👍] login page opened !');

    //await sleep(4000)
    await page.waitForSelector('#userName')
    await page.type('#userName','SENMAU62',{delai:50});
    //await sleep(3000)
    await page.waitForSelector('#userPassword')
    await page.type('#userPassword','M3rckx',{delai:50});
    await page.keyboard.press('Enter');
    
    sleep(5000)
    console.log('[👍] Login Done ! ');

    try{
        fs.unlinkSync(`./public/assets/login.png`);
    }catch(e){
        console.log(e)
    }

    await page.screenshot({ path: './public/assets/login.png'});
}

module.exports = {login}