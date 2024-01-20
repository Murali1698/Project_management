//aquiring mongoose connection
const mongoose = require('mongoose');

//creating a schema
const listSchema = new mongoose.Schema({
    memberUsername:{
         type : String,
         required : true
    },
    memberPassword:{
        type : String,
        required : true
    }
})

//setting the collection name
const list = mongoose.model('memberlogin', listSchema);

//exporting list
module.exports = list;