const mongoose = require('mongoose');
const Data_Schema = new mongoose.Schema({
    Song_Name:{type:String},
    Song:{type:String},
    Song_Image:{type:String},
    Artist:{type:String},
    Genre:{type:String},
    Isliked:{type:String,default:"Unliked"}
})
module.exports = mongoose.model('table2',Data_Schema)