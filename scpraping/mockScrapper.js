const puppeteer = require('puppeteer');
//const login = require('./user');
const {saveToCsv,csvToXls,freeBtachFile} = require('./file');
const {handleLogin,login,sessionExpired} = require('./pageCheck')
const sleep = require('./helper');
const fs = require ('fs');
const { resolve } = require('path');
const { param } = require('express/lib/request');
//const login = require('./user');
// const login = require('./user');

// DATA
//let link = 'https://service.europe.arco.biz/ktmthinclient/Validation.aspx';
var browser;
var page;

async function createBrowser(){
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: true,
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('[👍] browser .. ');
    return browser
}
async function createPage(browser){
    const page = await browser.newPage();
    console.log('[👍] new page created  ..');
    return page
}

async function firstLogin(){
    await page.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')
        .then(async ()=>{
            console.log('[👍] Login page opened')
            await login(page)
        })
        .catch((e)=>console.log("Go to Login page erro :: "+e))
}

const restartBrowser = async(param)=>{ // param is debug
    browser = await createBrowser()
    page = await createPage(browser)
    if(param===true){
        await firstLogin(page)
    }
    // console.log(">>>>>>>>>"+scapStatus)
    return new Promise((resolve)=>resolve(true))
}

// restartBrowser()
// (async()=>{
//     await restartBrowser();
// })()

//await restartBrowser()

async function fetchData(){
    await page.goto('https://service.europe.arco.biz/ktmthinclient/Validation.aspx')
    // RUN puppeteer
    await sessionExpired(page)
        .then(async(expired)=>{
            if(expired===true){
                await restartBrowser(true)
                console.log("[👍] handle seesion expired")
            }
            else if(expired===false){
                console.log("[👍] session not expired")
            }
            else
                console.log('[x] Error handling promise resolve bool on session expired')
            
        })
        .catch(async(e)=>{
            await restartBrowser(true)
            console.log("ERR catch sessionExpiored")
        })
    sleep(5000)
    
    
    //  await page.goto('https://service.europe.arco.biz/ktmthinclient/Validation.aspx')
    //      .then(()=>console.log("[👍] validation page opened"))
    //      .catch((e)=>console.log('Goto validation Fail page'))
    
    // Wait for selector
    await page.waitForSelector('.x-grid3-row-table tr',{visible:true,timeout: 0})
        .then(()=>console.log('Selector ok'))

    let rows = await page.evaluate(
            ()=> Array.from(window.document.querySelectorAll('.x-grid3-row-table tr'))
            .map((row,i)=>{
                let data = {
                    index : i+1,
                    batch : row.querySelector('div.x-grid3-col-name').innerText,
                    priority : row.querySelector('div.x-grid3-col-0').innerText,
                    client : row.querySelector('div.x-grid3-col-batchType').innerText,
                    document : row.querySelector('div.x-grid3-col-6').innerText,
                    date : row.querySelector('div.x-grid3-col-2').innerText,
                    status : row.querySelector('div.x-grid3-col-status').innerText
                }
                return data
            })
    )
    
// Filter data
    rows = rows.filter((e)=>e.status=="Ready")
    console.log("Total file scraped "+rows.length)
    console.log(rows);

// Saving file
    await freeBtachFile()           // delete last batch file saved
    await saveToCsv(rows,'batch');  // await csv file before conversion
    csvToXls('batch');
    //await browser.close();        
    return (rows);
    // close the browser
}

module.exports = {fetchData,restartBrowser,browser,page}