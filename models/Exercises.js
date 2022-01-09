const mongoose = require('mongoose')

module.exports= mongoose.model('Exercises', new mongoose.Schema({
    name: {type:String, required:true, maxlength:50},
    date: {type:Date, required:true},
    startTime: {type:String, required:true},
    endTime: {type:String, required:true},
    location: {type:String, required:true, maxlength:50},
    participants: {type:String, required:true,}
}));