const express = require ("express");
const app = express();
const path = require ("path")
//const scraper = require("scraper")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res)=> {
    let rows = [{
        batch: 'stad_hasselt-02- BATCH 7259572',
        status: 'Ready',
        document: '1'
      },
      {
        batch: 'stad_vilvoorde-05- BATCH 5253295',
        status: 'Ready',
        document: '16'
      },
      {
        batch: 'agb_boortmeerbeek-MULTI- BATCH 5',
        status: 'Ready',
        document: '1'
      },
      { batch: 'BATCH 4120578', status: 'Ready', document: '3' },
      {
        batch: 'ocmw_heistopdenberg-02- BATCH 72',
        status: 'Ready',
        document: '3'
      },
      {
        batch: 'ocmw_gingelom-02- BATCH 7259582',
        status: 'Ready',
        document: '1'
      }]
    res.render('index', {rows : rows});
});

app.get('/data',(req,res)=>{
    res.send('Data here')
})

const port = 3000;
app.listen(port,()=>{
    console.log('Server is UP ! : localhost:'+port)
})