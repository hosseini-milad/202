const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  username: { type: String},
  customerID:{type:String, unique: true},
  cName: { type: String},
  sName:{ type: String},
  phone: { type: String},
  password: { type: String },
  mobile:{type: String },
  email: { type: String},
  access:{type:String},
  meliCode:{type:String},
  Address:{type:String},
  cityId:{type:String},

  official:{ type: String },
  status:{ type: String },
  Code:{ type: String },
  StockId:{ type: String },
  
  imageUrl1:{ type: String },
  imageUrl2:{ type: String },

  date:{type:Date} 
});

module.exports = mongoose.model("customers", customerSchema);