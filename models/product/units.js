const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const UnitSchema = new Schema({
    title:  String,
    id:String
})
module.exports = mongoose.model('unit',UnitSchema);