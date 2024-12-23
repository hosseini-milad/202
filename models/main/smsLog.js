const mongoose = require('mongoose');

const SmsSchema = new mongoose.Schema({
    messageid:  Number,
    message:  String,
    sender:   String,
    receptor:String,
    date: Date
    
})
module.exports = mongoose.model('smslog',SmsSchema);