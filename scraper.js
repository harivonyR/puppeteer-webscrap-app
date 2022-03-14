const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    console.log('[👍] browser .. ');

    const page = await browser.newPage();
    console.log('[👍] page  ..');

    await page.goto('https://marketingplatform.google.com/about/partners/find-a-partner');
    console.log('[👍] page target ..');

    const partners = await page.evaluate(
        async ()=> await Array.from(document.querySelectorAll('.inner-container'))
        
        .map(partner=>{
            let data = {
                title : partner.querySelector('h3.title').innerText,
                link : partner.querySelector('h3.title a').href,
                partnerType : partner.querySelector('li a').innerText.trim(),
                logo : partner.querySelector('.logo-wrapper img').src
                }
            return data
            }
        )
    )

    console.log('[👍] scrap ok');

    // log received data
    console.log(partners);

    await browser.close();
})();