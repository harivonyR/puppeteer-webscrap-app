const ObjectsToCsv = require('objects-to-csv');
const convertCsvToXlsx = require('@aternus/csv-to-xlsx');
const fs = require('fs')
/* Save data to csv */
async function saveToCsv(data,filename){
  const csv = new ObjectsToCsv(data);
  let destination = `./public/assets/${filename}.csv`
  //console.log(await csv);
  // Save to file:
  await csv.toDisk(destination);
 
  // Return the CSV file as string:
  console.log(await csv.toString());
}

/* Convert the actual csv to xls*/
async function csvToXls(filename){
  //let source = path.join(__dirname, 'report.csv');
  //let destination = path.join(__dirname, 'converted_report.xlsx');
  let source = `./public/assets/${filename}.csv`
  let destination = `./public/assets/${filename}.xls`
  try{
    fs.unlinkSync(`./public/assets/${filename}.xls`);
  }catch(e){
    console.log(e)
  }
  try {
    convertCsvToXlsx(source, destination);
    } catch (e) {
    console.error(e.toString());
  } 
}

module.exports = {saveToCsv,csvToXls};