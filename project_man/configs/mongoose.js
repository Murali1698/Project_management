//getting mongoose module
const mongoose = require('mongoose');
//connection to databse
mongoose.connect('mongodb://localhost:27017/proj_man');
//aquire connection
const db = mongoose.connection;

//error
db.on('error', console.error.bind(console, "error in connecting databse"));

//up and running db
db.once('open', function(){
    console.log("the connection to db is done");
});