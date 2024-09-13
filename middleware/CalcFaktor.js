const cart = require("../models/product/cart")
const NewCode = require("./NewCode")


const CalcFaktor=async(cartData,userData)=>{
    if(!cartData){
        return
    }
    if(!cartData.cart)
        return
    var userCode = userData.customerID
    if(!userCode||userCode.length<3) userCode = "000"
    if(userCode.length>3)  userCode= userCode.substr(0, 3)
    const faktorNo = await NewCode("F"+userCode)
    var faktorData = {
        faktorNo:faktorNo,
        progressDate: Date.now(),
        userId:userData._id,
        customerID:userData.customerID,
        totalCount:cartData.cartDetail&&cartData.cartDetail.cartCount,
        totalDiscount:0,
        totalPrice:cartData.cartDetail&&cartData.cartDetail.cartPrice,
    }
    var faktorItems=[]
    for(var i=0;i<cartData.cart.length;i++){
        var faktorTemp = cartData.cart[i]
        faktorTemp.faktorNo = faktorNo
        faktorItems.push({
            faktorNo:faktorNo,
            sku: faktorTemp.sku,
            ItemID:faktorTemp.ItemID,
            unitId:faktorTemp.unitId,
            initDate: Date.now(),
            description:faktorTemp.description,
            price:faktorTemp.price,
            totalPrice:faktorTemp.totalPrice,
            count:faktorTemp.count,
            
            discount:faktorTemp.discount,
        })
    }
    return({faktorData,faktorItems})
}

module.exports =CalcFaktor