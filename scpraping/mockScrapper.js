const puppeteer = require('puppeteer');
const login = require('../user')
//const saveToCsv = require('./file')

// DATA
let link = 'https://service.europe.arco.biz/ktmthinclient/Validation.aspx';

async function scrap() {

// RUN puppeteer
    const browser = await puppeteer.launch({
        headless: false
    });
    console.log('[👍] browser .. ');

    const page = await browser.newPage();
    console.log('[👍] new page created  ..');


// LOGIN
    await login(browser)

    await page.goto(link);
    console.log('[👍] Main page opened')

    // SCRAP data
    await page.waitForSelector('.x-grid3-row-table tr')
    .then(()=>console.log('selector ok'))

    let rows = await page.evaluate(
            ()=> Array.from(window.document.querySelectorAll('.x-grid3-row-table tr'))
            .map((row)=>{
                let data = {
                    batch : row.querySelector('div.x-grid3-col-name').innerText,
                    status : row.querySelector('div.x-grid3-col-status').innerText,
                    document : row.querySelector('div.x-grid3-col-6').innerText
                }
                return data
            })
    )
    
    // CONCATENATE the new result
        //res = [...res,...properties];
    
    // LOG received data
    console.log(rows);
    return (rows);
    // Data struggling
    //res = res.filter((e)=>e!=null)

    // Save to the folder
    //saveToCsv(res,'french_property');

    //await browser.close();
}

module.exports = {scrap}