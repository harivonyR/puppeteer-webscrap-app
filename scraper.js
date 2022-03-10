const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  console.log('browser ok ..');

  const page = await browser.newPage();
  console.log('page ok ..')

  await page.goto('https://marketingplatform.google.com/about/partners/find-a-partner');
  console.log('page target ok ..')
  // take screen shot
  // await page.screenshot({ path: 'example.png' });


    const titleList = await page.evaluate(
        ()=> Array.from(document.querySelectorAll('h3 a')).map((partner)=>partner.innerText) // cf difference innerHtml/textContent/
    )
    console.log('scrap ok ..')


    console.log(titleList)

  await browser.close();
})();