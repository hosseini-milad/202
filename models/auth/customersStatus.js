const mongoose = require("mongoose");

const customerStatus = new mongoose.Schema({
  status:{type:String},
  statusId:{type:String}
});

module.exports = mongoose.model("cStatus", customerStatus);