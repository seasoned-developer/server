const mongoose = require('mongoose');

const Schemax = new mongoose.Schema({

    username : {
        type : String, 
        required : true
    }, 
    fullName : {
        type : String, 
        required : true
    }, 
    bio : {
        type : String, 
        default : ""
    },
    password : {
        type : String, 
        required : true
    }, 
    picturePath : {
        type : String, 
        required : false, 
        default : "https://i.pinimg.com/originals/7e/8c/81/7e8c8119bf240d4971880006afb7e1e6.jpg"
    }, 
    isConnected : {
        type : Boolean, 
        default : false
    }
     
}, {
    timestamps : true
});


module.exports = mongoose.model('users', Schemax);