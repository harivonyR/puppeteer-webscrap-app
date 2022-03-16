const puppeteer = require('puppeteer');

// DATA
let res = [];
let link = 'https://www.french-property.com/properties-for-sale?start_page=1';
let totalPage = 4;

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

    page.goto(link,{waitUntil: 'load', timeout : 0});
    // Browse to page
    for(let pageNumber=1;  pageNumber<=totalPage;pageNumber++){
        // page.goto(link+pageNumber,{waitUntil: 'load', timeout : 0});
    
        // Stop Browser loading after 20s
        await new Promise(resolve => setTimeout(resolve, 20000))
            .then(()=>{
                page._client.send("Page.stopLoading");
                console.log('[👍] Page '+pageNumber);
            });
    
        // Scrap page
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

        // Concatenate the new result 
        res = [...res,...properties];
        console.log('[👍] Scrap '+pageNumber);
        
        await page.click("li.next a");
    }
    
    // log received data
    console.log(res);

    await browser.close();
})();
