const puppeteer = require('puppeteer');
const login = require('./user')
const saveToCsv = require('./file')

// DATA
let res = [];
let link = 'https://www.french-property.com/properties-for-sale?start_page=1';
let totalPage = 2;

(async () => {

// RUN puppeteer
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: false,
        headless: true,
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('[👍] browser .. ');

    const page = await browser.newPage();
    console.log('[👍] page  ..');

    page.goto(link,{waitUntil: 'load', timeout : 0});

// LOGIN
    await login(browser)
    console.log('login complete')
// BROWSE PAGE
    for(let pageNumber=1; pageNumber<=totalPage; pageNumber++){
        // page.goto(link+pageNumber,{waitUntil: 'load', timeout : 0});
    
        // STOP Browser loading after 20s
        await new Promise(resolve => setTimeout(resolve, 20000))
            .then(()=>{
                page._client.send("Page.stopLoading");
                console.log('[👍] Page '+pageNumber);
            });
    
    // SCRAP data
        let properties = await page.evaluate(
            ()=> Array.from(document.querySelectorAll('li.property_listing'))
            .map((propertie)=>{
                try{
                    let data = {
                        name : propertie.querySelector('h3 a').innerText,
                        price : propertie.querySelector('h4').innerText,
                        region : propertie.querySelector('span.region strong').innerText
                    }
                    return data;
                }
                catch(e){
                    console.log("ERR :"+e) ;
                }
            })
        )

    // CONCATENATE the new result 
        res = [...res,...properties];
        console.log('[👍] Scrap '+pageNumber);
        
        await page.click("li.next a");
    }
    
    // LOG received data
    console.log(res);

    // Data struggling
    res = res.filter((e)=>e!=null)

    // Save to the folder
    saveToCsv(res,'french_property');

    //await browser.close();
})();
