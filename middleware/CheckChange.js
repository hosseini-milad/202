const faktor = require("../models/product/faktor")
const faktorItem = require("../models/product/faktorItem")


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
            return({error:"Edited Quantity"})
            
        }
        if(newItems[i].Fee != oldItems[i].price){
            return({error:"Edited Price"})
            
        }
    }
    return('')
    //console.log(oldItems)
    //console.log(newItems)
}

module.exports =CheckChange