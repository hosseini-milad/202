const faktor = require("../models/product/faktor")
const faktorItem = require("../models/product/faktorItem")
const products = require("../models/product/products")


const CheckChange=async(faktorNo,rahItems)=>{
    const newItems = rahItems.result
    const mainFaktor = await faktor.findOne({InvoiceID:faktorNo})
    const oldItems = await faktorItem.find({faktorNo:mainFaktor.faktorNo})

    if(!mainFaktor) return('')
    if(!newItems || !oldItems) return('')
        
        //console.log(mainFaktor)
	    //console.log(oldItems)

    if(newItems.length != oldItems.length){
        await updateItems(newItems,mainFaktor.faktorNo,oldItems)
        return({error:'تعداد آیتم ها یکسان نیستند'})
    }
    var newState = ''
    for(var i=0;i<newItems.length;i++){
        /*console.log("start editing ",mainFaktor.faktorNo)
        console.log(newItems[i].Quantity ,oldItems[i].count)
        console.log(newItems[i].Fee ,(oldItems[i]&&oldItems[i].price))
        console.log("----------------------------")*/
        if(newItems[i].Quantity != oldItems[i].count){
            await updateItems(newItems,mainFaktor.faktorNo,oldItems)
            return({error:"Edited Quantity"})
            
        }
        else if(newItems[i].Fee != (oldItems[i]&&oldItems[i].price)){
            await updateItems(newItems,mainFaktor.faktorNo,oldItems)
            return({error:"Edited Price"})
            
        }
    }
    return('')
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