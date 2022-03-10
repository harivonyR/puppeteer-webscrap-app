const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  console.log('[👍] browser .. ');

  const page = await browser.newPage();
  console.log('[👍] page  ..');

  await page.goto('https://marketingplatform.google.com/about/partners/find-a-partner');
  console.log('[👍] page target ..');
  // take screen shot
  // await page.screenshot({ path: 'example.png' });

    const partners = await page.evaluate(
        ()=> Array.from(document.querySelectorAll('.inner-container'))
        
        .map(partner=>({
            title : partner.querySelector('h3.title').innerText,
            partnerType : partner.querySelector('li a').innerText,
            logo : partner.querySelector('.logo-wrapper img').src
            })
        )
    )

    console.log('[👍] scrap ok');

    console.log(partners);

    await browser.close();
})();