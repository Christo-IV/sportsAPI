const mongoose = require('mongoose')

module.exports= mongoose.model('Account', new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"user"},
    name: {type:String, required:true, minlength:2, maxlength:50},
    balance: {type:Number, required:true, minlength:1},
    currency: {type:String, required:true},
    number: {type:String, required:true, maxlength:100, unique:true}
}));