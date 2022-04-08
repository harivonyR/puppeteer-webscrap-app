const puppeteer = require('puppeteer');
//const login = require('./user');
const {saveToCsv,csvToXls,freeBtachFile} = require('./file');
const {handleLogin,login,sessionExpired} = require('./pageCheck')
const sleep = require('./helper');
const fs = require ('fs');
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

(async()=>{
    browser = await createBrowser()
    page = await createPage(browser)
    await firstLogin(page)
})()


async function fetchData(){

    await page.goto('https://service.europe.arco.biz/ktmthinclient/Validation.aspx')
        .then(()=>console.log("Page Validation page reached"))
        .catch((e)=>console.log('Goto Fail page'))

    // RUN puppeteer
    await sessionExpired(page)
        .then(async()=>{
            console.log("Session is expired, wait for press Enter")
            await page.keyboard.press('Enter')
            await login(page)
            console.log("Enter is pressed")
        })
        .catch((e)=>console.log("Session not expired"))
    sleep(5000)
    
    //await page.goto(link,{waitUntil: 'networkidle2', timeout: 35000});
    console.log('[👍] Main page opened')
    
    // delete last screensht
    try{
        fs.unlinkSync(`./public/assets/screenshot.png`)
    }catch(e){
        console.log(e)
    }

    sleep(3000)
    await page.screenshot({ path: './public/assets/screenshot.png'});
    
    
    
    // Wait for selector
    await page.waitForSelector('.x-grid3-row-table tr',{visible:true,timeout: 0})
        .then(()=>console.log('Selector ok'))

    let rows = await page.evaluate(
            ()=> Array.from(window.document.querySelectorAll('.x-grid3-row-table tr'))
            .map((row,i)=>{
                let data = {
                    index : i+1,
                    batch : row.querySelector('div.x-grid3-col-name').innerText,
                    document : row.querySelector('div.x-grid3-col-6').innerText,
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

module.exports = {fetchData}