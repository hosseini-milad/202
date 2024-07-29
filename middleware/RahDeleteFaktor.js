const CreateNotif = require("./CreateNotif")
const CreateRahkaran = require("./CreateRahkaran")
const RahErrorHandle = require("./RahErrorHandle")
const RahkaranLogin = require("./RahkaranLogin")
const RahkaranPOST = require("./RahkaranPOST")
const RahNewFaktor = require("./RahNewFaktor")
const sendSmsUser = require("./sendSms")
const faktorItems = require('../models/product/faktorItem');
const faktor = require('../models/product/faktor');

const RahDeleteFaktor=async(faktorData,cookieData,res)=>{
    
    var rahkaranResult =  await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/DeleteQuotation",
        faktorData.InvoiceID,cookieData)

    if(!rahkaranResult) {
            const loginData = await RahkaranLogin()
            var cookieSGPT = '';
            if(loginData){
                cookieSGPT = loginData.split('SGPT=')[1]
                cookieSGPT = cookieSGPT.split(';')[0]
            }
        // console.log(cookieSGPT)
            res.cookie("sg-dummy","-")
            res.cookie("sg-auth-SGPT",cookieSGPT)
            //console.log(`sg-auth-SGPT=${cookieSGPT}`)
            rahkaranResult =await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/DeleteQuotation",
                faktorData.InvoiceID,{"sg-auth-SGPT":cookieSGPT})
    }
    //console.log(rahkaranResult)
    

    return({rahkaranResult})
}
module.exports =RahDeleteFaktor