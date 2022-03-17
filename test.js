const saveToCsv = require('./file.js')


let data = [
    {
        name : "Harivony",
        lastname : "RATEFIARISON"
    },
    {
        name : "Harivony 1",
        lastname : "RATEFIARISON 1"
    }

]

saveToCsv(data,"test_to_csv")