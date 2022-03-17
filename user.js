const puppeteer = require('puppeteer');
const sleep = require('./helper')

async function login (browser){
    console.log('[👍] login browser .. ');

    const loginPage = await browser.newPage();
    console.log('[👍] login page ready  ..');

    //loginPage.goto('https://www.french-property.com/properties-for-sale?start_page=1',{waitUntil: 'load', timeout : 0});

    loginPage.goto('https://www.french-property.com/login')

    await new Promise(resolve => setTimeout(resolve, 20000))
            .then(()=>{
                loginPage._client.send("Page.stopLoading");
                console.log('[👍] login opened ');
            });
    
    // await loginPage.waitForSelector('li.user a')     
    // await loginPage.click('li.user a');
    
    await sleep(10000)
    await loginPage.waitForSelector('#email')
    await loginPage.type('#email','harivonyratefiarison@gmail.com',{delai:100});
    
    await sleep(50000)
    await loginPage.waitForSelector('#password')
    await loginPage.type('#password','test123456',{delai:100});
    await loginPage.keyboard.press('Enter');
    console.log('[👍] Login Complete ');
}

module.exports = login;
