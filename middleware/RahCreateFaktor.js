const CreateNotif = require("./CreateNotif")
const CreateRahkaran = require("./CreateRahkaran")
const RahErrorHandle = require("./RahErrorHandle")
const RahkaranLogin = require("./RahkaranLogin")
const RahkaranPOST = require("./RahkaranPOST")
const RahNewFaktor = require("./RahNewFaktor")
const sendSmsUser = require("./sendSms")
const faktorItems = require('../models/product/faktorItem');
const faktor = require('../models/product/faktor');

const RahCreateFaktor=async(faktorData,RahFaktor,rahItems,userData,cookieData,res)=>{
    const rahKaranFaktor = await CreateRahkaran(faktorData.faktorData,
        faktorData.faktorItems,userData)
    //return(rahKaranFaktor)
    var faktorDetail = ''
    var faktorItemsDetail = []

    var rahkaranResult =  await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/PlaceQuotation",
        rahKaranFaktor,cookieData)

   
    if(rahkaranResult&&rahkaranResult.status==500){
        return({message: RahErrorHandle(rahkaranResult.result),error:true})
        
    }
    if(rahkaranResult&&rahkaranResult.result){
        faktorDetail = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotations",
        {
            "PageSize":1,
            "MasterEntityID":rahkaranResult.result
        },cookieData)
        faktorItemsDetail = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotationItems",
        {
            "PageSize":10,
            "MasterEntityID":rahkaranResult.result
        },cookieData)
    }

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
        rahkaranResult =await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/PlaceQuotation",
        rahKaranFaktor,{"sg-auth-SGPT":cookieSGPT})
        return(rahkaranResult)
        return
        if(!rahkaranResult||rahkaranResult.status!="200"){
            return({message:rahkaranResult?RahErrorHandle(rahkaranResult.result):"سرور راهکاران قطع است",error:true})
            
        }
        faktorDetail = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotations",
        {
            "PageSize":1,
            "MasterEntityID":rahkaranResult.result
        },{"sg-auth-SGPT":cookieSGPT})
        //console.log(faktorDetail)
        faktorItemsDetail = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotationItems",
        {
            "PageSize":10,
            "MasterEntityID":rahkaranResult.result
        },{"sg-auth-SGPT":cookieSGPT})
    }
    
    const RahFaktorData = await RahNewFaktor(faktorData,faktorDetail,
        faktorItemsDetail,userData)
    const rahId = faktorDetail.result&&faktorDetail.result[0]&&faktorDetail.result[0].Number
    const newFaktor = await faktor.create({...RahFaktorData.mainData,
        //InvoiceID:rahkaranResult.result,
        rahDetail:faktorDetail,
        rahItems:faktorItemsDetail,
        active:true,InvoiceID:rahkaranResult.result,
        rahId:rahId,
        status:"در انتظار تایید"})
        await CreateNotif(rahkaranResult.result,userData._id,"ثبت سفارش ")
        await sendSmsUser(userData._id,process.env.OrderSubmit,rahId)    
    const newFaktorItems = await faktorItems.create(RahFaktorData.itemData)

    return({faktorItemsDetail,newFaktorItems,newFaktor})
}
module.exports =RahCreateFaktor