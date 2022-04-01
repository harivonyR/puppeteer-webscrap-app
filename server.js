const express = require ("express");
const app = express();
const path = require ("path")
const mockScrapper = require ('./scpraping/mockScrapper')
const fs = require ('fs');
const sleep = require("./scpraping/helper");

//const scraper = require("scraper")
var rows = []
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',  (req, res)=> {
    res.render('index', {})
});

app.get('/data',async (req,res)=>{
    // res.send('loading')
    rows = await mockScrapper.scrap()
    res.render('data', {rows : rows})
})

app.get('/download', async (req,res)=>{
    res.download('./public/assets/batch.xls'); 
})

app.get('/loading',async(req,res)=>{
    ///let data = await sleep(5000)
    res.render('loading')
})

const port = process.env.PORT || 3535;
app.listen(port,()=>{
    console.log('Server is up on http://localhost:'+port)
})

