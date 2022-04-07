const express = require ("express");
const app = express();
const path = require ("path")
const fs = require ('fs');
const {emiter} = require('./event/EventEmmiter');
const mockScrapper = require ('./scpraping/mockScrapper')

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

async function handleScraping(req,res,status,data){
    if (status.onScrap===false&&status.data===false){
        status.onScrap = true;
        console.log('Scrap on')                              
        data.rows = await mockScrapper.scrap()
            .then(()=>{status.onScrap = false; console.log('scrap off')})
            .catch((e)=>console.log(e))
    }
    else 
        res.send('ERROR : handling event scrap && data')  
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',  (req, res)=>{
    if(data.rows.length>0){
        res.render('data', {rows : data.rows})
    }
    else{
        res.render('index', {})
    }
});

app.get('/data',async (req,res)=>{
    await handleScraping(req,res,scapStatus,data)
        .then(()=>res.render('data', {rows : data.rows}))
        .catch((e)=>console.log(e))
})

app.get('/download', async (req,res)=>{
    res.download('./public/assets/batch.xls'); 
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
