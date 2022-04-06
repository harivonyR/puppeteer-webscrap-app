const puppeteer = require('puppeteer');
//const login = require('./user');
const {saveToCsv,csvToXls} = require('./file');
const sleep = require('./helper');
const fs = require ('fs')

// DATA
let link = 'https://service.europe.arco.biz/ktmthinclient/Validation.aspx';

async function scrap(){

    // Free xls 
    try{
        fs.unlinkSync(`./public/assets/batch.xls`);
        console.log('file deleted')
      }catch(e){
        console.log('unlinck failed '+e)
    }

// RUN puppeteer
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: true,
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('[👍] browser .. ');

    const page = await browser.newPage();
    console.log('[👍] new page created  ..');

//////////// BEGIN LOGIN
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
/////////////// END LOGIN

    sleep(5000)
    //await page.goto(link,{waitUntil: 'networkidle2', timeout: 35000});
    console.log('[👍] Main page opened')
    
    // manual page stop
    // await new Promise(resolve => setTimeout(resolve, 20000))
    //         .then(()=>{
    //             page._client.send("Page.stopLoading");
    //             console.log('[x] Page loading stopped');
    //         }).catch((error)=>{
    //             console.log(error)
    //         })

    // delete last screensht
    try{
        fs.unlinkSync(`./public/assets/screenshot.png`)
    }catch(e){
        console.log(e)
    }

    sleep(3000)
    await page.screenshot({ path: './public/assets/screenshot.png'});
    
    // stop loading
//    await new Promise(resolve => setTimeout(resolve, 1000))
//            .then(()=>{
//                page._client.send("Page.stopLoading");
//                console.log('[👍] Page stopped');
//            })
//            .catch((e)=>{console.log('ERR'+e)})
    
    // Block running script
//    page.on("request", request => {
//        if (request.resourceType() === "script"){
//          request.abort()
//        } else {
//          request.continue()
//        }
//      })
//    console.log('script stopped')
    
    // Wait for selector
    await page.waitForSelector('.x-grid3-row-table tr',{visible:true,timeout: 0})
        .then(()=>console.log('Selector ok'))

    let rows = await page.evaluate(
            ()=> Array.from(window.document.querySelectorAll('.x-grid3-row-table tr'))
            .map((row)=>{
                let data = {
                    batch : row.querySelector('div.x-grid3-col-name').innerText,
                    document : row.querySelector('div.x-grid3-col-6').innerText,
                    status : row.querySelector('div.x-grid3-col-status').innerText
                }
                return data
            })
    )
    
    // CONCATENATE the new result
        //res = [...res,...properties];
    
    // Filter data
    rows = rows.filter((e)=>e.status=="Ready")
    console.log("Total file scraped "+rows.length)
    console.log(rows);

    

    saveToCsv(rows,'batch');
    csvToXls('batch');

    return (rows);

    // close the browser
    //await browser.close();
}

module.exports = {scrap}