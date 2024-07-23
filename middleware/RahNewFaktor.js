const MultiPrice = require("./MultiPrice")
const NormalTax = require("./NormalTax")

const RahNewFaktor=async(faktorData,RahFaktor,rahItems,userData)=>{
    var rahFaktorData = RahFaktor&&RahFaktor.result
    var rahFaktorItems = rahItems&&rahItems.result
    if(!rahFaktorData||!rahFaktorItems) return
    var faktorMainData =faktorData.faktorData
    //var convertedFaktor = faktorData
    faktorMainData.originData = {
        InvoiceID:faktorMainData.ID,
        count:faktorMainData.totalCount,
        totalPrice:faktorMainData.totalPrice,
        totalDiscount:faktorMainData.totalDiscount
    }
    faktorMainData.totalPrice = rahFaktorData&&
        rahFaktorData[0]&&rahFaktorData[0].Price
    faktorMainData.totalAddition = rahFaktorData&&
        rahFaktorData[0]&&rahFaktorData[0].Additions
    faktorMainData.totalDiscount = rahFaktorData&&
        rahFaktorData[0]&&rahFaktorData[0].Reductions
    faktorMainData.netPrice = rahFaktorData&&
        rahFaktorData[0]&&rahFaktorData[0].NetPrice
    var faktorItemData =faktorData.faktorItems
    for(var i=0;i<rahFaktorItems.length;i++){
        faktorItemData[i].originData = {
            count:faktorItemData[i].count,
            sku:faktorItemData[i].sku,
            price:faktorItemData[i].price,
            totalPrice:faktorItemData[i].totalPrice
        }
        faktorItemData[i].count=rahFaktorItems[i]&&rahFaktorItems[i].Quantity
        faktorItemData[i].price=rahFaktorItems[i]&&rahFaktorItems[i].Fee
        faktorItemData[i].totalPrice=rahFaktorItems[i]&&rahFaktorItems[i].Price
        faktorItemData[i].totalAddition=rahFaktorItems[i]&&rahFaktorItems[i].Additions
        faktorItemData[i].totalDiscount=rahFaktorItems[i]&&rahFaktorItems[i].Reductions
        
        faktorItemData[i].netPrice=rahFaktorItems[i]&&rahFaktorItems[i].NetPrice
    }
    
    
    return({mainData:faktorMainData,itemData:faktorItemData})
}
module.exports =RahNewFaktor