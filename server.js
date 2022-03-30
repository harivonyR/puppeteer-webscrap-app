const express = require ("express");
const app = express();
const path = require ("path")
const mockScrapper = require ('./scpraping/mockScrapper')
//const scraper = require("scraper")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',  (req, res)=> {
    //
    res.render('index', {})
});

app.get('/data',async (req,res)=>{
    let rows = await mockScrapper.scrap()
    res.render('data', {rows : rows})
})

const port = 3000;
app.listen(port,()=>{
    console.log('Server is up on http://localhost:'+port)
})