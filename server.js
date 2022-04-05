const express = require ("express");
const app = express();
const path = require ("path")
const logger = require('heroku-logger')
const fs = require ('fs');

const sleep = require("./scpraping/helper");
const mockScrapper = require ('./scpraping/mockScrapper')

const PORT = process.env.PORT || 8080;
var rows = []

async function fillRows(){
    rows = await mockScrapper.scrap()
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',  (req, res)=> {
    res.render('index', {})
    //fillRows()
});



app.get('/data',async (req,res)=>{
    rows = await mockScrapper.scrap()   // ISSUE, timoeout request erro 503 on heroku server
    res.render('data', {rows : rows})
})

app.get('/screenshot_main', async (req,res)=>{
    res.download('./public/assets/screenshot.png'); 
 })

 app.get('/screenshot_login', async (req,res)=>{
    res.download('./public/assets/login.png'); 
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
    logger.info(`Express is working on port ${port}`);
});

