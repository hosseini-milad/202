const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title:  { type: String},
    sku: { type: String , unique: true},
    enTitle:String,
    description:String,
    ItemID:{ type: String , unique: true},
    brandId:String,
    catId:String,
    catTitle:String,
    config:String,
    filters:{type:Object,default:{}},
    uploadImage:String,
    active:Boolean,
    imageUrl: {
        type:String
    },
    thumbUrl:String,
    perBox:Number,
    price:String,
    categories:String
})
module.exports = mongoose.model('product',ProductSchema);