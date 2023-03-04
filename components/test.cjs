const fs = require("fs");

// Read the JSON file
const data = fs.readFileSync("../public/traits/existingDinos.json", "utf8");

// Parse the JSON data
const jsonData = JSON.parse(data);

// Search for a property and change its value
const modifyData = jsonData.map(trait=>{
    
    Object.keys(trait).map(traitName => {
        if(typeof trait[traitName]=== "string"){
            trait[traitName] = trait[traitName].replace(/\s+/g, "-").toLowerCase()
        }
        return trait
    })

    return trait
})



// Stringify the JSON data
const newData = JSON.stringify(jsonData, null, 2);

// Write the updated data back to the file
fs.writeFileSync("../public/traits/existingDinos1.json", newData, "utf8");
