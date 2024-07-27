const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FaktorSchema = new Schema({
    faktorNo:{ type: String ,unique:true},
    faktorUrl:{ type: String},
    initDate: { type: Date, default: Date.now },
    progressDate: { type: Date },
    userId:{ type: String },
    customerID:{ type: String },
    originData:{type:Object},
    totalCount:{ type: String },
    totalDiscount:{ type: String },
    totalPrice:{ type: String },
    totalAddition:{ type: String },
    isEdit:{type:Boolean,default:false},
    isDone:{type:Boolean,default:false},
    active:{type:Boolean},
    netPrice:{ type: String },
    InvoiceID:{ type: String },
    InvoiceNumber:{ type: String },
    rahDetail:{ type: Object },
    rahItems:{ type:Object },
    rahId:{ type:String },
    status:{type:String}
})
module.exports = mongoose.model('faktor',FaktorSchema);