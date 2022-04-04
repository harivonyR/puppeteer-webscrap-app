const express = require ("express");
const app = express();
const path = require ("path")
const PORT = process.env.PORT || 8080;
const mockScrapper = require ('./scpraping/mockScrapper')
const fs = require ('fs');
const sleep = require("./scpraping/helper");
const logger = require('heroku-logger')

//const scraper = require("scraper")
var rows = []

async function fillRows(){
    rows = await mockScrapper.scrap()
    logger.info('rows filled up '+rows)
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',  (req, res)=> {
    res.render('index', {})
    fillRows()
});

app.get('/data',async (req,res)=>{
    //rows = await mockScrapper.scrap()   // ISSUE, timoeout request erro 503 on heroku server
    res.render('data', {rows : rows})
})

app.get('/download', async (req,res)=>{
    res.download('./public/assets/batch.xls'); 
 })

// app.get('/loading',async(req,res)=>{
//     ///let data = await sleep(5000)
//     res.render('loading')
// })

const server = app.listen(process.env.PORT || PORT, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
  });

