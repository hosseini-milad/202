const cart = require("../models/product/cart");
const products = require("../models/product/products");
const PriceCount = require("./PriceCount");


const CalcCart=async(userId)=>{
    const cartDetail = await cart.find({userId:userId}).lean()
    var cartPrice = 0;
    var cartWeight = 0;
    var cartTotal = 0;
    for(var i=0;i<cartDetail.length;i++){
        var productDetail = await products.findOne({sku:cartDetail[i].sku})
        cartDetail[i].title=productDetail.title
        cartDetail[i].productDetail=productDetail
        var price = cartDetail[i].price&&parseInt(cartDetail[i].price)
        var weight = productDetail.weight&&parseFloat(productDetail.weight)
        if(!price){
            cartDetail[i].price = 1250000
            price = 1250000
        }
        var totalPrice = price*parseFloat(cartDetail[i].count)//parseInt
        var totalWeight = weight*parseFloat(cartDetail[i].count)
        cartDetail[i].totalPrice = totalPrice
        cartDetail[i].weight = weight
        cartDetail[i].totalWeight = totalWeight
        cartPrice += totalPrice
        cartWeight += totalWeight
        cartTotal += parseFloat(cartDetail[i].count)//parseInt
    }
    return({cart:cartDetail,cartDetail:
        {cartPrice:cartPrice,
        cartDiscount:0,
        cartWeight:cartWeight,
        cartTax:PriceCount(cartPrice,.1),
        cartTotal:PriceCount(cartPrice,1.1),
        cartCount:cartTotal}})
}

module.exports =CalcCart