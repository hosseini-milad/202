const express = require('express');
const { default: fetch } = require("node-fetch");
const request = require("request");
const fs = require('fs')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
const auth = require("../middleware/auth");
var ObjectID = require('mongodb').ObjectID;
const { OLD_SITE_URL,API_PORT,StockId,SaleType} = process.env;
var im = require('imagemagick');
const resizeImg = require('resize-img');
 
const ServiceSchema = require('../models/product/Services');
const ProductSchema = require('../models/product/products');
const BrandSchema = require('../models/product/brand')
const category = require('../models/product/category');
const { env } = require('process');
const filterNumber = require('../middleware/Functions');

const productCount = require('../models/product/productCount');
const productPrice = require('../models/product/productPrice');
const NormalTax = require('../middleware/NormalTax');
const openOrders = require('../models/orders/openOrders');
const Filters = require('../models/product/Filters');
const factory = require('../models/product/factory');
const cart = require('../models/product/cart');
const CalcCart = require('../middleware/CalcCart');

/*Product*/
router.post('/fetch-product',jsonParser,async (req,res)=>{
    var productId = req.body.productId?req.body.productId:''
    try{
        if(!productId){
            res.json({filter:{}})
            return
        } 
        const productData = await ProductSchema.findOne({_id: ObjectID(productId)})
        const brandList = await BrandSchema.find({})
        const categoryList = await category.find({})
        const brandData = brandList.find(item=>item.brandCode==productData.brandId)
        const catData = categoryList.find(item=>item.catCode==productData.catId)
        console.log(catData)
        const filterList = catData&&catData.length&&
            await Filters.find({"category._id":catData._id.toString()})
       
        res.json({filter:productData,brandList:brandList,categoryList:categoryList,
        brandData:brandData,catData:catData,filterList:filterList})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/list-product',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)):0;
    try{const data={
        category:req.body.category,
        title:req.body.title,
        sku:req.body.sku,
        brand:req.body.brand,
        active:req.body.active,
        offset:req.body.offset,
        pageSize:pageSize
    }
        const productList = await ProductSchema.aggregate([
            { $match:data.title?{title:new RegExp('.*' + data.title + '.*')}:{}},
            { $match:data.sku?{sku:new RegExp('.*' + data.sku + '.*')}:{}},
            { $match:data.category?{category:data.category}:{}},
            { $match:(data.active&&data.active=="deactive")?{}:{catId:{$nin:["1","3","4","5"]}}},
            
            {$lookup:{from : "brands", 
            localField: "brandId", foreignField: "brandCode", as : "brandInfo"}},
            ])
            const products = productList.slice(offset,
                (parseInt(offset)+parseInt(pageSize)))  
            
            const typeUnique = [...new Set(productList.map((item) => item.category))];
            
           res.json({data:products,type:typeUnique,
            size:productList.length,success:true})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})



/*Category*/
router.post('/fetch-category',jsonParser,async (req,res)=>{
    var catId = req.body.catId?req.body.catId:''
    try{
        if(!catId){
            res.json({filter:{}})
            return
        }
        const catData = await category.findOne({_id: ObjectID(catId)})
        const catList = await category.find()
       res.json({filter:catData,options:catList})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/list-category',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)):0;
    try{const data={
        category:req.body.category,
        title:req.body.title,
        brand:req.body.brand,
        offset:req.body.offset,
        pageSize:pageSize
    }
        const catData = await category.aggregate([
            { $match:data.title?{title:new RegExp('.*' + data.title + '.*')}:{}},
            { $match:data.category?{category:data.category}:{}},
            
            ])
            const cats = catData.slice(offset,
                (parseInt(offset)+parseInt(pageSize)))  
            const typeUnique = [...new Set(cats.map((item) => item.category))];
            
           res.json({filter:cats,type:typeUnique,
            size:cats.length})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
/*Carts*/
router.get('/get-cart',auth,jsonParser,async (req,res)=>{
    const userId = req.headers["userid"]
    try{
        const myCart = await CalcCart(userId)
        res.json(myCart)
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/add-cart',auth,jsonParser,async (req,res)=>{
    const userId = req.headers["userid"]
    const data = req.body
    try{
        if(!data.sku){
            res.status(400).json({message:"کد محصول وارد نشده است"})
        }
        const cartFound = await cart.findOne({userId:userId,sku:data.sku})
        var newCount = cartFound?parseInt(cartFound.count):0
        newCount += parseInt(data.count)
        data.count = newCount
        cartFound?await cart.updateOne({userId:userId,sku:data.sku},{$set:data}):
        await cart.create({...data,userId:userId})
        
        const myCart = await CalcCart(userId)
        res.json({...myCart,message:"آیتم اضافه شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/remove-cart-item',auth,jsonParser,async (req,res)=>{
    const userId = req.headers["userid"]
    const sku = req.body.sku
    try{
        if(!sku){
            res.status(400).json({message:"کد محصول وارد نشده است"})
        }
        const cartFound = await cart.deleteOne({userId:userId,sku:sku})
        
        const myCart = await CalcCart(userId)
        res.json({...myCart,message:"آیتم حذف شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

module.exports = router;