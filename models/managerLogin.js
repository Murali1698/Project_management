//aquiring mongoose connection
const mongoose = require('mongoose');

//creating a schema
const listSchema = new mongoose.Schema({
    managerUsername:{
         type : String,
         required : true
    },
    managerPassword:{
        type : String,
        required : true
    }
})

//setting the collection name
const list = mongoose.model('managerlogin', listSchema);

//exporting list
module.exports = list;