const puppeteer = require('puppeteer');
//const cheerio = require ('cheerio')




(async () => {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: false,
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('[👍] browser .. ');


    const page = await browser.newPage();
    console.log('[👍] page  ..');

    await page.goto('https://www.french-property.com/properties-for-sale?currency=EUR&land_size_unit=m%C2%B2',{waitUntil: 'load', timeout : 0});
    
    //await new Promise(resolve => setTimeout(resolve, 20000));

    console.log('[👍] page target ..');

    let res = [];

    let proprieties = await page.evaluate(
        ()=> Array.from(document.querySelectorAll('li.property_listing'))
        .map((propriety)=>{
            try{
                let data = {
                    name : propriety.querySelector('h3 a').innerText,
                    price : propriety.querySelector('h4').innerText,
                    region : propriety.querySelector('span.region').innerText
                    
                    }
                return data;
            }
            catch(e){
                console.log(e)
            }
        })
    )

    // proprieties = await proprieties.map((propriety)=>{
    //     return propriety.textContent
    // })
    
    // proprieties = proprieties.map((propriety)=>{
    //     let data = {
    //         name :  propriety.querySelector('h4').innerText
    //         // price :         propriety.querySelector('.p24_price').innerText,
    //         // img :           propriety.querySelector('span.p24_image > img').src,
    //         // description :   propriety.querySelector('.p24_excerpt').innerText,
    //         // location :      propriety.querySelector('.p24_location').innerText
    //     }
    //     return data;
    // })
    console.log('[👍] scrap ok');

    // log received data
    console.log(proprieties);

    await browser.close();
})();
