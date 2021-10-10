const mongoose = require('mongoose')

module.exports= mongoose.model('Session', new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"user"}
}));