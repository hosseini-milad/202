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
const unitSchema = require("../models/product/units")
 
const ServiceSchema = require('../models/product/Services');
const ProductSchema = require('../models/product/products');
const BrandSchema = require('../models/product/brand')
const category = require('../models/product/category');
const { env } = require('process');
const Filters = require('../models/product/Filters');
const customerSchema = require('../models/auth/customers');
const cart = require('../models/product/cart');
const CalcCart = require('../middleware/CalcCart');
const CalcFaktor = require('../middleware/CalcFaktor');
const CreateRahkaran = require('../middleware/CreateRahkaran');
const RahkaranPOST = require('../middleware/RahkaranPOST');
const RahkaranLogin = require('../middleware/RahkaranLogin');
const faktor = require('../models/product/faktor');
const unitItems = require('../models/product/units');
const faktorItems = require('../models/product/faktorItem');
const products = require('../models/product/products');
const RahNewFaktor = require('../middleware/RahNewFaktor');
const slider = require('../models/main/slider');
const RahErrorHandle = require('../middleware/RahErrorHandle');
const sendSmsUser = require('../middleware/sendSms');

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
        //console.log(catData)
        const filterList = catData&&catData.length&&
            await Filters.find({"category._id":catData._id.toString()})
       
        res.status(200).json({filter:productData,brandList:brandList,categoryList:categoryList,
        brandData:brandData,catData:catData,filterList:filterList})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.get('/list-units',jsonParser,async (req,res)=>{
    try{
        const unitList = await unitItems.find({})
        res.status(200).json({data:unitList,message:"لیست دسته بندی ها"})
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
        unitId:req.body.unitId,
        active:req.body.active,
        offset:req.body.offset,
        search:req.body.search,
        pageSize:pageSize
    }
        const productList = await ProductSchema.aggregate([
            { $match:data.title?{title:new RegExp('.*' + data.title + '.*')}:{}},
            { $match:data.sku?{sku:new RegExp('.*' + data.sku + '.*')}:{}},
            { $match:data.unitId?{unitId:data.unitId}:{}},
            { $match:(data.active&&data.active=="deactive")?{}:{catId:{$nin:["1","3","4","5"]}}},
            { $match:data.search?{$or:[
                {title:new RegExp('.*' + data.search + '.*')},
                {sku:new RegExp('.*' + data.search + '.*')}
            ]}:{}},

            
            ])
            const products = productList.slice(offset,
                (parseInt(offset)+parseInt(pageSize))) 
            for(var i=0;i<products.length;i++){
                const unit = await unitSchema.findOne({id:products[i].unitId})
                products[i].unitName = unit?unit.title:''
            } 
            
            const typeUnique = [...new Set(productList.map((item) => item.category))];
            
           res.status(200).json({data:products,type:typeUnique,
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
       res.status(200).json({filter:catData,options:catList})
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
            
           res.status(200).json({filter:cats,type:typeUnique,
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
        res.status(200).json({...myCart,message:"سبد خرید"})
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
        const productData = await ProductSchema.findOne({sku:data.sku})
        
        if(!productData){
            res.status(400).json({message:"محصول یافت نشد"})
        }
        const cartFound = await cart.findOne({userId:userId,sku:data.sku})
        var newCount = cartFound?parseInt(cartFound.count):0
        newCount += parseInt(data.count)
        data.count = newCount
        data.ItemID = productData.ItemID
        data.unitId = productData.unitId
        data.price = productData.price
        cartFound?await cart.updateOne({userId:userId,sku:data.sku},{$set:data}):
        await cart.create({...data,userId:userId})
        
        const myCart = await CalcCart(userId)
        res.status(200).json({...myCart,message:"آیتم اضافه شد"})
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
        res.status(200).json({...myCart,message:"آیتم حذف شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/update-cart-item',auth,jsonParser,async (req,res)=>{
    const userId = req.headers["userid"]
    const sku = req.body.sku
    const count = req.body.count
    try{
        if(!sku){
            res.status(400).json({message:"کد محصول وارد نشده است"})
        }
        if(!count){
            res.status(400).json({message:"تعداد محصول وارد نشده است"})
        }
        const cartFound = await cart.updateOne(
            {userId:userId,sku:sku},{$set:{count:count}})
        
        const myCart = await CalcCart(userId)
        res.status(200).json({...myCart,message:"آیتم بروز شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.get('/cart-to-faktor',auth,jsonParser,async (req,res)=>{
    const cookieData = req.cookies
    const userId = req.headers["userid"]
    try{
        const userData = await customerSchema.findOne({_id:ObjectID(userId)})
        if(!userData){
            res.status(400).json({message:"مشتری یافت نشد "})
        }
        const myCart = await CalcCart(userId)

        const faktorData = await CalcFaktor(myCart,userData)
        
        if(!faktorData){ 
            res.status(400).json({message:"خطا در سبد خرید"})
        }
        if(!faktorData.faktorItems||!faktorData.faktorItems.length){
            res.status(400).json({message:"سبد خرید خالی است"})
        }
        //console.log(faktorData.faktorData,faktorData.faktorItems,userData)
        const rahKaranFaktor = await CreateRahkaran(faktorData.faktorData,faktorData.faktorItems,userData)
        //console.log(rahKaranFaktor)
        var faktorDetail = ''
        var faktorItemsDetail = []
        //res.status(200).json({message: rahKaranFaktor})
        //return

        var rahkaranResult =  await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/PlaceQuotation",
            rahKaranFaktor,cookieData)
        if(rahkaranResult.status==500){
            res.status(400).json({message: RahErrorHandle(rahkaranResult.result)})
            return
        }
        if(rahkaranResult&&rahkaranResult.result){
            faktorDetail = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotations",
            {
                "PageSize":1,
                "MasterEntityID":rahkaranResult.result
            },cookieData)
            faktorItemsDetail = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotationItems",
            {
                "PageSize":1,
                "MasterEntityID":rahkaranResult.result
            },cookieData)
        }

        if(!rahkaranResult) {
            const loginData = await RahkaranLogin()
            var cookieSGPT = '';
            if(loginData){
                cookieSGPT = loginData.split('SGPT=')[1]
                cookieSGPT = cookieSGPT.split(';')[0]
            }
        // console.log(cookieSGPT)
            res.cookie("sg-dummy","-")
            res.cookie("sg-auth-SGPT",cookieSGPT)
            //console.log(`sg-auth-SGPT=${cookieSGPT}`)
            rahkaranResult =await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/PlaceQuotation",
            rahKaranFaktor,{"sg-auth-SGPT":cookieSGPT})
            if(!rahkaranResult||rahkaranResult.status!="200"){
                res.status(400).json({message:rahkaranResult?RahErrorHandle(rahkaranResult.result):"سرور راهکاران قطع است"})
                return
            }
            faktorDetail = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotations",
            {
                "PageSize":1,
                "MasterEntityID":rahkaranResult.result
            },{"sg-auth-SGPT":cookieSGPT})
            //console.log(faktorDetail)
            faktorItemsDetail = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotationItems",
            {
                "PageSize":1,
                "MasterEntityID":rahkaranResult.result
            },{"sg-auth-SGPT":cookieSGPT})
        }
        
        const RahFaktorData = await RahNewFaktor(faktorData,faktorDetail,
            faktorItemsDetail,userData)
        const newFaktor = await faktor.create({...RahFaktorData.mainData,
            //InvoiceID:rahkaranResult.result,
            rahDetail:faktorDetail,
            rahItems:faktorItemsDetail,
            active:true,InvoiceID:rahkaranResult.result,
            status:"ثبت شده"})
            await sendSmsUser(userId,process.env.OrderSubmit,
                rahkaranResult.result)    
        const newFaktorItems = await faktorItems.create(RahFaktorData.itemData)
        const cartFound = await cart.deleteMany({userId:userId})
 
        
        res.status(200).json({status:rahkaranResult&&rahkaranResult.status,
            rahkaranResult,message:"سفارش ثبت شد",log:RahFaktorData,
            newFaktor:newFaktor})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.post('/list-faktor',auth,jsonParser,async (req,res)=>{
    const userId = req.headers["userid"]
    const search = req.body.search
    try{
        const myFaktors = await faktor.aggregate([
            {$match:{userId:userId}},
            { $match:search?{faktorNo:new RegExp('.*' + search + '.*')}:{}},
            {$lookup:{
                from : "faktoritems", 
                localField: "faktorNo", 
                foreignField: "faktorNo", 
                as : "faktorItems"
            }},{$sort:{progressDate:-1}}
        ])
        var finalFaktor = []
        for(var i=0;i<myFaktors.length;i++){
            var faktorList=[]
            var faktorData = myFaktors[i].faktorItems
            for(var j=0;j<faktorData.length;j++){
                var faktorTitle = await products.findOne({sku:faktorData[j].sku})
                faktorList.push({...faktorData[j],title:faktorTitle.title})
            }
            finalFaktor.push({...myFaktors[i],faktorItems:faktorList})
        }
        
        res.status(200).json({data:finalFaktor,success:true,message:"لیست سفارشات"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/fetch-faktor',auth,jsonParser,async (req,res)=>{
    const userId = req.headers["userid"]
    const faktorNo = req.body.faktorNo
    try{
        if(!faktorNo){
            res.status(400).json({message:"کد سفارش وارد نشده است"})
        }
        const myFaktors = await faktor.findOne({userId:userId,faktorNo:faktorNo})
        if(!myFaktors){
            res.status(400).json({message:"سفارش یافت نشد "})
        }
        const myFaktorItems = await faktorItems.aggregate([
            {$match:{faktorNo:faktorNo}},
            {$lookup:{
                from : "products", 
                localField: "sku", 
                foreignField: "sku", 
                as : "productData"
            }}
        ])
        res.status(200).json({data:myFaktors, faktorItems:myFaktorItems,
            success:true,message:"اطلاعات سفارشات"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/cancel-faktor',auth,jsonParser,async (req,res)=>{
    const cookieData = req.cookies
    const userId = req.headers["userid"]
    const faktorNo = req.body.faktorNo
    try{
        if(!faktorNo){
            res.status(400).json({message:"کد سفارش وارد نشده است"})
        }
        const myFaktor = await faktor.findOne({userId:userId,faktorNo:faktorNo})
        if(!myFaktor){
            res.status(400).json({message:"سفارش یافت نشد "})
        }

        var rahkaranResult =  await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/DeleteQuotation",
            myFaktor.InvoiceID,cookieData)

        if(!rahkaranResult) {
                const loginData = await RahkaranLogin()
                var cookieSGPT = '';
                if(loginData){
                    cookieSGPT = loginData.split('SGPT=')[1]
                    cookieSGPT = cookieSGPT.split(';')[0]
                }
            // console.log(cookieSGPT)
                res.cookie("sg-dummy","-")
                res.cookie("sg-auth-SGPT",cookieSGPT)
                //console.log(`sg-auth-SGPT=${cookieSGPT}`)
                rahkaranResult =await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/DeleteQuotation",
                    myFaktor.InvoiceID,{"sg-auth-SGPT":cookieSGPT})
        }
        //console.log(rahkaranResult)
        await faktor.updateOne({userId:userId,faktorNo:faktorNo},
            {$set:{active:false,status:"باطل شده"}})
        res.status(200).json({rahkaranResult:rahkaranResult,orderData:myFaktor,
            success:true,message:"سفارش لغو شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.get('/sliders', async (req,res)=>{
    try{
        const SlidersList = await slider.find()
        res.json({data:SlidersList,message:"slider list"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;