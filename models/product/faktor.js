const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FaktorSchema = new Schema({
    faktorNo:{ type: String ,unique:true},
    initDate: { type: Date, default: Date.now },
    progressDate: { type: Date },
    userId:{ type: String },
    customerID:{ type: String },

    totalCount:{ type: String },
    totalDiscount:{ type: String },
    totalPrice:{ type: String },
    InvoiceID:{ type: String },
    InvoiceNumber:{ type: String },
})
module.exports = mongoose.model('faktor',FaktorSchema);