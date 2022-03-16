const puppeteer = require('puppeteer');
//const cheerio = require ('cheerio')




(async () => {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: true,
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('[👍] browser .. ');


    const page = await browser.newPage();
    console.log('[👍] page  ..');

    // Browse
    page.goto('https://www.french-property.com/properties-for-sale?currency=EUR&land_size_unit=m%C2%B2',{waitUntil: 'load', timeout : 0});
    
    // Stop Browser loading after 20s
    await new Promise(resolve => setTimeout(resolve, 20000))
        .then(()=>{
            page._client.send("Page.stopLoading");
            console.log('[👍] page target ..');
        });

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
                console.log("ERR :"+e);
            }
        })
    )

    console.log('[👍] scrap ok');

    // log received data
    console.log(proprieties);

    await browser.close();
})();
