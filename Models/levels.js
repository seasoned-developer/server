const mongoose = require('mongoose');

const Schemax = new mongoose.Schema({



}, {
    timestamps : true
});


module.exports = mongoose.model('more', Schemax);