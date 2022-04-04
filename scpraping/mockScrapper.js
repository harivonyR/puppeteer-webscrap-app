const puppeteer = require('puppeteer');
const login = require('./user');
const {saveToCsv,csvToXls} = require('./file');

// DATA
let link = 'https://service.europe.arco.biz/ktmthinclient/Validation.aspx';

async function scrap() {
// RUN puppeteer
    const browser = await puppeteer.launch({
        headless: true
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
    //.then(()=>console.log('selector ok'))

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
    
    // LOG received data
    rows = rows.filter((e)=>e.status=="Ready")
    
    console.log(rows);
    saveToCsv(rows,'batch');
    csvToXls('batch');

    return (rows);

    // Save to the folder
    

    //await browser.close();
}

module.exports = {scrap}