const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const CartSchema = new Schema({
    sku:  { type : String},
    ItemID:  { type : String},
    initDate: { type: Date, default: Date.now },
    progressDate: { type: Date, default: Date.now  },
    unitId:{type:String},
    userId:{ type: String },
    payValue:{ type: String },
    stockId:{type:String},
    description:{type:String},
    price:{type:String},
    totalPrice:{type:String},
    weight:{type:String},
    totalWeight:{type:String},
    count:{type:String},
    discount:{type:String},
})
module.exports = mongoose.model('cart',CartSchema);