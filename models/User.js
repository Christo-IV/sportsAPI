const mongoose = require('mongoose')

module.exports= mongoose.model('User', new mongoose.Schema({
    email: {type:String, required:true, minlength:2, maxlength:50, unique:true},
    password: {type:String, required:true, maxlength:50}
}));