const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FaktorItemSchema = new Schema({
    faktorNo:{ type: String },
    sku:  { type : String },
    initDate: { type: Date, default: Date.now },
    progressDate: { type: Date },
    totalAddition:{ type: String },
    netPrice:{ type: String },
    payValue:{ type: String },
    stockId:{type:String},
    description:{type:String},
    originData:{type:Object},
    price:{type:String},
    totalPrice:{type:String},
    count:{type:Number},
    discount:{type:String},
})
module.exports = mongoose.model('faktoritem',FaktorItemSchema);