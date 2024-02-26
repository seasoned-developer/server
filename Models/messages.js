const mongoose = require('mongoose');

const Schemax = new mongoose.Schema({

    sender : {
        type : String, 
        required : true
    },
    senderId : {
        type : String, 
        required : true
    },
    message : {
        type : String, 
        required : true
    },
    picturePath : {
        type : String, 
        required : true
    },
    fullName : {
        type : String, 
        required : true
    },
    time : {
        type : Date, 
        required : false
    }
}, {
    timestamps : true
});


module.exports = mongoose.model('messages', Schemax);