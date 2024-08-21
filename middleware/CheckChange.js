const faktor = require("../models/product/faktor")
const faktorItem = require("../models/product/faktorItem")
const products = require("../models/product/products")
const CompareValue = require("./CompareValue")


const CheckChange=async(faktorNo,rahItems,rahOrder)=>{
    const newItems = rahItems.result
    const newOrder = rahOrder.result&&rahOrder.result[0]
    const mainFaktor = await faktor.findOne({InvoiceID:faktorNo})
    const oldItems = await faktorItem.find({faktorNo:mainFaktor.faktorNo})
    const id = mainFaktor.rahId
    //console.log(rahItems)
    //console.log(rahOrder)
    //return
    if(!mainFaktor) return('')
    if(!newItems || !oldItems) return('')
        
        //console.log(mainFaktor)
	    //console.log(oldItems)

    if(newItems.length != oldItems.length){
        await updateOrder(newOrder,newItems,id)
        await updateItems(newItems,mainFaktor.faktorNo,oldItems)
        return({id:id,error:'تعداد آیتم ها یکسان نیستند'})
    }
    if(CompareValue(newOrder.Additions,mainFaktor.totalAddition)==false){
        await updateOrder(newOrder,newItems,id)
        await updateItems(newItems,mainFaktor.faktorNo,oldItems)
        return({id:id,error:"اضافات تغییر کرده است"})
    }
    if(CompareValue(newOrder.Reductions,mainFaktor.totalDiscount)==false){
        await updateOrder(newOrder,newItems,id)
        await updateItems(newItems,mainFaktor.faktorNo,oldItems)
        return({id:id,error:"تخفیفات تغییر کرده است",newDiscount:newOrder.Reductions,
            oldDiscount:mainFaktor.totalDiscount,orderData:newOrder
        })
    }
    var newState = ''
    for(var i=0;i<newItems.length;i++){
        if(newItems[i].Quantity != oldItems[i].count){
            await updateItems(newItems,mainFaktor.faktorNo,oldItems)
            await updateOrder(newOrder,newItems,id)
            return({id:id,error:"Edited Quantity"})
            
        }
        /*else if(newItems[i].Fee != (oldItems[i]&&oldItems[i].price)){
            await updateItems(newItems,mainFaktor.faktorNo,oldItems)
            await updateOrder(mainFaktor,newItems,id)
            return({id:id,error:"Edited Price"})
            
        }*/
    }
    return('')
}
const updateOrder = async(newOrder,newItems,id)=>{
    var totalCount = 0
    for(var i=0;i<newItems.length;i++){
        totalCount += parseFloat(newItems[i].Quantity)
    }
    var resultOrder = {
        totalCount:totalCount,
        totalDiscount:newOrder.Reductions,
        totalPrice:newOrder.Price,
        totalAddition:newOrder.Additions,
        netPrice:newOrder.NetPrice,

    }
    const result =await faktor.updateOne({rahId:id},{$set:resultOrder})
    //console.log(result)
}
const updateItems=async(newItems,faktorNo,oldItems)=>{
    var resultItems = []
    for(var i=0;i<newItems.length;i++){
        const newItem = newItems[i]
        const product = await products.findOne({ItemID:newItem.ProductRef})
        
        const oldItem = oldItems.find(item=>item.sku==product.sku)
        var isEditPrice = ((oldItem&&oldItem.price) == newItem.Fee)?0:1
        var isEditCount = ((oldItem&&oldItem.count) == newItem.Quantity)?0:1
        resultItems.push({
            faktorNo:faktorNo,
            sku:product&&product.sku,
            totalAddition:newItem.Additions,
            initDate: oldItem?oldItem.initDate:Date.now(),
            progressDate: Date.now(),
            netPrice:newItem.NetPrice,
            originData:oldItem?oldItem.originData:{},
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