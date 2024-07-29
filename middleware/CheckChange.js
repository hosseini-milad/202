const faktor = require("../models/product/faktor")
const faktorItem = require("../models/product/faktorItem")
const products = require("../models/product/products")


const CheckChange=async(faktorNo,rahItems)=>{
    const newItems = rahItems.result
    const mainFaktor = await faktor.findOne({InvoiceID:faktorNo})
    const oldItems = await faktorItem.find({faktorNo:mainFaktor.faktorNo})
    if(!mainFaktor) return({error:'خطای 1'})
    if(!newItems || !oldItems) return({error:'خطای 2'})
    
    if(newItems.length != oldItems.length){
        return({error:'تعداد آیتم ها یکسان نیستند'})
    }
    var newState = ''
    for(var i=0;i<newItems.length;i++){
        //console.log(newItems[i].Fee)
        //console.log(oldItems[i].price)
        if(newItems[i].Quantity != oldItems[i].count){
            await updateItems(newItems,mainFaktor.faktorNo,oldItems)
            return({error:"Edited Quantity"})
            
        }
        else if(newItems[i].Fee != oldItems[i].price){
            return({error:"Edited Price"})
            
        }
    }
    return('')
    //console.log(oldItems)
    //console.log(newItems)
}
const updateItems=async(newItems,faktorNo,oldItems)=>{
    var resultItems = []
    for(var i=0;i<newItems.length;i++){
        const newItem = newItems[i]
        //console.log(oldItem)
        const product = await products.findOne({ItemID:newItem.ProductRef})
        
        const oldItem = oldItems.find(item=>item.sku==product.sku)
        //console.log(oldItem)
        var isEditPrice = (oldItem.price == newItem.Fee)?0:1
        var isEditCount = (oldItem.count == newItem.Quantity)?0:1
        resultItems.push({
            faktorNo:faktorNo,
            sku:product&&product.sku,
            totalAddition:newItem.Additions,
            initDate: oldItem.initDate,
            progressDate: Date.now(),
            netPrice:newItem.NetPrice,
            originData:oldItem.originData,
            price:newItem.Fee,
            totalPrice:newItem.NetPrice,
            count:newItem.Quantity,
            isEditPrice,isEditCount,
            totalDiscount:newItem.Reductions}

        )
    }
    await faktorItem.deleteMany({faktorNo:faktorNo})
    await faktorItem.create(resultItems)
}

module.exports =CheckChange