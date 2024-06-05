const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FaktorSchema = new Schema({
    faktorNo:{ type: String ,unique:true},
    initDate: { type: Date, default: Date.now },
    progressDate: { type: Date },
    userId:{ type: String },
    customerID:{ type: String },
    originData:{type:Object},
    totalCount:{ type: String },
    totalDiscount:{ type: String },
    totalPrice:{ type: String },
    InvoiceID:{ type: String },
    InvoiceNumber:{ type: String },
    rahDetail:{ type: Object },
    rahItems:{ type:Object },
    status:{type:String}
})
module.exports = mongoose.model('faktor',FaktorSchema);