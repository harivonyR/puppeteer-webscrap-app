const puppeteer = require('puppeteer');
const login = require('./user')
const saveToCsv = require('./file')

// DATA
let link = 'https://service.europe.arco.biz/ktmthinclient/Validation.aspx';
(async () => {

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

    // STOP Browser loading after 20s
    // await new Promise(resolve => setTimeout(resolve, 10000))
    //     .then(()=>{
    //         page._client.send("Page.stopLoading");
    //         console.log('[👍] Page '+pageNumber);
    //     });

    // SCRAP data
    await page.waitForSelector('.x-grid3-row-table tr')

    let rows = await page.evaluate(
            ()=> Array.from(window.document.querySelectorAll('.x-grid3-row-table tr'))
                .map((row)=>row.querySelector('div.x-grid3-col-name').innerText)
    )
    // CONCATENATE the new result
        //res = [...res,...properties];
    
    // LOG received data
    console.log(rows);

    // Data struggling
    //res = res.filter((e)=>e!=null)

    // Save to the folder
    //saveToCsv(res,'french_property');

    //await browser.close();
})();
