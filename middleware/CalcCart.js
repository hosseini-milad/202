const cart = require("../models/product/cart");
const products = require("../models/product/products");


const CalcCart=async(userId)=>{
    const cartDetail = await cart.find({userId:userId}).lean()
    var cartPrice = 0;
    var cartTotal = 0;
    for(var i=0;i<cartDetail.length;i++){
        var productDetail = await products.findOne({sku:cartDetail[i].sku})
        
        cartDetail[i].productDetail=productDetail
        var price = cartDetail[i].price&&parseInt(cartDetail[i].price)
        if(!price){
            cartDetail[i].price = 1250000
            price = 1250000
        }
        var totalPrice = price*parseInt(cartDetail[i].count)
        cartDetail[i].totalPrice = totalPrice
        cartPrice += totalPrice
        cartTotal += parseInt(cartDetail[i].count)
    }
    return({cart:cartDetail,cartDetail:
        {cartPrice:cartPrice,cartCount:cartTotal}})
}

module.exports =CalcCart