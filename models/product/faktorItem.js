const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FaktorItemSchema = new Schema({
    faktorNo:{ type: String },
    sku:  { type : String },
    initDate: { type: Date, default: Date.now },
    progressDate: { type: Date },
    payValue:{ type: String },
    stockId:{type:String},
    description:{type:String},
    price:{type:String},
    totalPrice:{type:String},
    count:{type:Number},
    discount:{type:String},
})
module.exports = mongoose.model('faktoritem',FaktorItemSchema);