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
router.post('/editCats',jsonParser,async(req,res)=>{
    var catId= req.body.catId?req.body.catId:''
    if(catId === "new")catId=''
        const data = {
            title:  req.body.title,
            link: req.body.link,
            type:req.body.type,
            value:req.body.value,
            parent:req.body.parent,
            description:req.body.description,
            sku: req.body.sku, 
            catCode:req.body.catCode,
            price: req.body.price,
            quantity: req.body.quantity,
            sort: req.body.sort,
            iconUrl:  req.body.iconUrl,
            imageUrl:  req.body.imageUrl,
            thumbUrl:  req.body.thumbUrl
        }
        var catResult = ''
        if(catId) catResult=await category.updateOne({_id:ObjectID(catId)},
            {$set:data})
        else
        catResult= await category.create(data)
        try{
        
        res.json({result:catResult,success:catId?"Updated":"Created"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
/*Filters*/
router.post('/fetch-filter',jsonParser,async (req,res)=>{
    var filterId = req.body.filterId?req.body.filterId:''
    try{
        if(!filterId){
            res.json({filter:{}})
            return 
        }
        const categoryData = await category.find()
        const filterData = await Filters.findOne({_id: ObjectID(filterId)})
       res.json({filter:filterData,category:categoryData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/list-filter',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)):0;
    try{const data={
        category:req.body.category,
        title:req.body.title,
        enTitle:req.body.enTitle,
        type:req.body.type,
    }
        const filterList = await Filters.aggregate([
            { $match:data.title?{title:new RegExp('.*' + data.title + '.*')}:{}},
            { $match:data.category?{category:data.category}:{}},
            { $match:data.type?{type:data.type}:{}},
            ])
            const filters = filterList.slice(offset,
                (parseInt(offset)+parseInt(pageSize)))  
            const typeUnique = [...new Set(filterList.map((item) => item.category))];
            
           res.json({filter:filters,type:typeUnique,
            size:filterList.length})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/edit-filter',jsonParser,async(req,res)=>{
    var filterId= req.body.filterId?req.body.filterId:''
    if(filterId === "new")filterId=''
    try{ 
        const data = {
            category:req.body.category,
            title:req.body.title,
            enTitle:req.body.enTitle,
            type:req.body.type,
            optionsP:req.body.optionsP,
            optionsN:req.body.optionsN,
            sort:req.body.sort
        }
        var filterResult = ''
        if(filterId) filterResult=await Filters.updateOne({_id:filterId},
            {$set:data})
        else
        filterResult= await Filters.create(data)
        
        res.json({result:filterResult,success:filterId?"Updated":"Created"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

/*Factory*/
router.post('/fetch-factory',jsonParser,async (req,res)=>{
    var factoryId = req.body.factoryId?req.body.factoryId:''
    try{
        if(!factoryId){
            res.json({filter:{}})
            return
        }
        const filterData = await factory.findOne({_id: ObjectID(factoryId)})
       res.json({filter:filterData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/list-factory',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)):0;
    try{const data={
        category:req.body.category,
        title:req.body.title,
        enTitle:req.body.enTitle,
        type:req.body.type,
    }
        const filterList = await factory.aggregate([
            { $match:data.title?{title:new RegExp('.*' + data.title + '.*')}:{}},
            { $match:data.category?{category:data.category}:{}},
            { $match:data.type?{type:data.type}:{}},
            ])
            const filters = filterList.slice(offset,
                (parseInt(offset)+parseInt(pageSize)))  
            const typeUnique = [...new Set(filterList.map((item) => item.category))];
              
           res.json({filter:filters,type:typeUnique,
            size:filterList.length})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/edit-factory',jsonParser,async(req,res)=>{
    var factoryId= req.body.factoryId?req.body.factoryId:''
    if(factoryId === "new")factoryId=''
    try{ 
        const data = {
            title:req.body.title,
            enTitle:req.body.enTitle
        }
        var filterResult = ''
        if(factoryId) filterResult=await factory.updateOne({_id:factoryId},
            {$set:data})
        else
        filterResult= await factory.create(data)
        
        res.json({result:filterResult,success:factoryId?"Updated":"Created"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;