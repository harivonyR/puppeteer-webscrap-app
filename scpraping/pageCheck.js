const puppeteer = require('puppeteer')
const sleep = require('./helper')
const fs = require('fs')

var session = {
    expired : false
}

async function sessionExpired(page){
    return await new Promise (async(resolve,reject)=>{
        await page.waitForSelector('#ext-gen28',{timeout:1000})
        .then(()=>{
            resolve(true)
        })
        .catch((e)=>{
            console.log('seemms user is logged in')
            reject(false)
        })
    })
}

async function loadLogin(page){
    if(await sessionExpired()){
        await page.keyboard.press('Enter');
    }
    else{
        await page.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')
        console.log('[👍] login page opened !');
    }

}   

async function handleLogin(page){                         // login page
    console.log('[👍] handleLogin ');

    console.log('[👍] login page is openning ');

    await loadLogin(page)

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

async function login(page){                         // login page
    console.log('[👍] handleLogin ');

    console.log('[👍] login page is openning ');

    await page.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')

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

module.exports = {handleLogin,login}