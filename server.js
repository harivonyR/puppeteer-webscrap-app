const express = require ("express");
const app = express();
const path = require ("path")
const fs = require ('fs');
const {emiter} = require('./event/EventEmmiter');
const {scrap} = require ('./scpraping/mockScrapper');
const sleep = require("./scpraping/helper");

const PORT = process.env.PORT || 8080;

var data = {
    rows : [{
        index:2,
        batch:'Batch tesssst',
        document:1000,
        status:'Ready'
    }]
}

var scapStatus = {
    data : false,
    onScrap : false,
}

async function waitForScrap(scapStatus){       // wait scraping to be done
    (function listen(){
        setTimeout(
            ()=>{
                if(scapStatus.onScrap===true) listen
                else return
            }
        ,2000)
    })
}

async function handleScraping(req,res,status){
    console.log('Status in handle is :'+status.onScrap)
    if (status.onScrap===false){   // no scraping on, so start it
        status.onScrap = true;
            console.log('Scrap on')                              
        
        let data = await scrap()   
            console.log('Scrap end')

        return data
    }
    if (status.onScrap===true){         // wait for scraping to be done
        await waitForScrap(scapStatus)
        await sleep(10000)
        return data.rows
    }
    else
        res.send('ERROR : handling event scrap && data')  
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',  (req, res)=>{
    if(data.rows.length>0)
        res.render('data', {rows : data.rows})
    else
        res.render('index')
});

app.get('/data',async (req,res)=>{
    data.rows = await handleScraping(req,res,scapStatus)
    res.render('data', {rows :  data.rows})
    scapStatus.onScrap = false

    console.log('Scrap off :: data rendered')
})

app.get('/download', async (req,res)=>{
    await waitForScrap(scapStatus)
    try {res.download('./public/assets/batch.xls');}
    catch (e){console.log('Download error ::'+e)}
 })

app.get('/event', async (req,res)=>{
    emiter.emit('scrapOn')
    res.render('event')
 })

// app.get('/screenshot_main', async (req,res)=>{
//     res.download('./public/assets/screenshot.png'); 
//  })

//  app.get('/screenshot_login', async (req,res)=>{
//     res.download('./public/assets/login.png'); 
//  })

// app.get('/unlink', async (req,res)=>{
//     try{
//         fs.unlinkSync(`./public/assets/batch.xls`);
//         console.log('file deleted')
//       }catch(e){
//         console.log('unlinck failed '+e)
//     }
//  })
// app.get('/loading',async(req,res)=>{
//     ///let data = await sleep(5000)
//     res.render('loading')
// })

const server = app.listen(process.env.PORT || PORT, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
});


// node.js version with stable puppeeter

// Lambda runtime Node.js 14.x
// Puppeteer-core version 10.1.0
