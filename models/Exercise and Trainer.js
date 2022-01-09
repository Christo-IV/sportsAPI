const mongoose = require('mongoose')

module.exports= mongoose.model('Exercises and Trainer', new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"user"},
    exerciseId: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"exercise"}
}));