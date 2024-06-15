const user =require("../models/auth/customers");
var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: process.env.SMS_API
});
//console.log(process.env.SMS_API)
async function sendSmsUser(userId,template,message,token2,token3){
    const userData= await user.findOne({_id:userId});
    var phoneNumber=userData.phone
    if(phoneNumber){
      const verifySms = api.VerifyLookup({
        token: message,//parseInt(message.replace(/^\D+/g, '')),
        //token2:parseInt(token2.replace(/^\D+/g, '')),
        template: template,//"mgmVerify",
        receptor: phoneNumber
      },function(response,status) {
        //console.log(response);
        console.log(status);
        }) 
        return (verifySms)
    }
  }
  module.exports = sendSmsUser