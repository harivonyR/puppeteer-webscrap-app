const puppeteer = require('puppeteer');
//const cheerio = require ('cheerio')

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    console.log('[👍] browser .. ');

    const page = await browser.newPage();
    console.log('[👍] page  ..');

    await page.goto('https://www.property24.com/for-sale/northern-cape/8');
    console.log('[👍] page target ..');

    let data = [];

    let proprieties = await page.evaluate(
        ()=> Array.from(document.querySelectorAll('.p24_regularTile'))
    )
    
    proprieties = proprieties.map((propriety)=>{
        let data = {
            price :         propriety.querySelector('.p24_price').innerText,
            img :           propriety.querySelector('span.p24_image > img').src,
            description :   propriety.querySelector('.p24_excerpt').innerText,
            location :      propriety.querySelector('.p24_location').innerText
        }
        return data;
    })
    console.log('[👍] scrap ok');

    // log received data
    console.log(proprieties);

    await browser.close();
})();
