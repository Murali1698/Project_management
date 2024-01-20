//aquiring mongoose connection
const mongoose = require('mongoose');

//creating a schema
const listSchema = new mongoose.Schema({
    email:{
         type : String,
         required : true
    },
    name:{
        type : String,
        required : true
    },
    tasktype:{
        type : String,
        required : true
    },
    status: {
        type : String,
        required : true
    }
})

//setting the collection name
const list = mongoose.model('task', listSchema);

//exporting list
module.exports = list;