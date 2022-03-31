const ObjectsToCsv = require('objects-to-csv');
 
async function saveToCsv(data,filename){
  const csv = new ObjectsToCsv(data);
 
  console.log(await csv);
  // Save to file:
  await csv.toDisk(`./public/assets/${filename}.csv`);
 
  // Return the CSV file as string:
  console.log(await csv.toString());
}

module.exports = saveToCsv;