const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    UserName:String,
    Password:String,
    Email:String,
    Likedsongs:[{
        id:Number,
        name:String,
        Song:String,
        IsLiked:String
    }]
})
module.exports = mongoose.model('table1',Schema)