const express = require ("express");
const app = express();
const path = require ("path")
const fs = require ('fs');

const mockScrapper = require ('./scpraping/mockScrapper')

const PORT = process.env.PORT || 8080;
var rows = []

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',  (req, res)=>{
    if(rows.length>0){
        res.render('data', {rows : rows})
    }
    else{
        res.render('index', {})
    }
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

app.get('/unlink', async (req,res)=>{
    try{
        fs.unlinkSync(`./public/assets/batch.xls`);
        console.log('file deleted')
      }catch(e){
        console.log('unlinck failed '+e)
    }
 })
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
