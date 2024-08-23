const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    UserName:String,
    Password:String,
    Email:String,
    Likedsongs:[{
        id:String,
        name:String,
        Song:String,
        Image:String,
        IsLiked:String
    }]
})
module.exports = mongoose.model('table1',Schema)