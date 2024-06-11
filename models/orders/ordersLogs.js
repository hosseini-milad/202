const mongoose = require("mongoose");

const OrderLogsSchema = new mongoose.Schema({
  userId:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  manageId: {type: String},
  orderNo:{type:String},
  description:{ type:Object },
  status:{ type: String },
  payStatus: {type: String},
  date:{ type: Date ,default:Date.now()}, 
  progressDate:{ type: Date ,default:Date.now()},
});

module.exports = mongoose.model("orderlogs", OrderLogsSchema);