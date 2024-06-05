const MultiPrice = require("./MultiPrice")
const NormalTax = require("./NormalTax")

const RahNewFaktor=async(faktorData,RahFaktor,rahItems,userData)=>{
    var rahFaktorData = RahFaktor&&RahFaktor.result
    var rahFaktorItems = rahItems&&rahItems.result
    var faktorMainData =faktorData.faktorData
    //var convertedFaktor = faktorData
    faktorMainData.originData = {
        InvoiceID:faktorMainData.ID,
        count:faktorMainData.count,
        totalPrice:faktorMainData.totalPrice,
        totalDiscount:faktorMainData.totalDiscount
    }
    faktorMainData.totalPrice = rahFaktorData&&
        rahFaktorData[0]&&rahFaktorData[0].Price
    var faktorItemData =faktorData.faktorItems
    for(var i=0;i<faktorItemData.length;i++){
        faktorItemData[i].originData = {
            count:faktorItemData[i].count,
            price:faktorItemData[i].price,
            totalPrice:faktorItemData[i].totalPrice
        }
        faktorItemData[i].count=rahFaktorItems[i].Quantity
        faktorItemData[i].price=rahFaktorItems[i].Fee
        faktorItemData[i].totalPrice=rahFaktorItems[i].Price
    }
    
    
    return({mainData:faktorMainData,itemData:faktorItemData})
}
module.exports =RahNewFaktor