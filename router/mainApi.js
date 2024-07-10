const express = require('express');
const router = express.Router()
const { default: fetch } = require("node-fetch");
const slider = require('../models/main/slider');
const authApi = require('./authApi');
const taskApi = require('./taskApi');
const yasApi = require('./yasApi');
const appApi = require('./appApi');
const cartApi= require('./cartApi');
const settingApi = require('./settingApi');
const productApi = require('./productApi');
const formApi = require('./formApi');
const paymentApi = require('./paymentApi');
const userApi = require('./userApi');
const panelUserApi = require('./panelUserApi')
const CRMPanelApi = require('./panelCrmApi')
const panelOrderApi = require('./panelOrderApi')
const panelProductApi = require('./panelProductApi')
const esaleApi = require('./esaleApi')
const panelFaktorApi = require('./faktorApi')
const sepidarFetch = require('../middleware/SepidarPost');
const products = require('../models/product/products');
const productPrice = require('../models/product/productPrice');
const productCount = require('../models/product/productCount');
const customers = require('../models/auth/customers');
const schedule = require('node-schedule');
const bankAccounts = require('../models/product/bankAccounts');
const updateLog = require('../models/product/updateLog');
const RahkaranLogin = require('../middleware/RahkaranLogin');
const RahkaranGET = require('../middleware/RahkaranGet');
const RahkaranPOST = require('../middleware/RahkaranPOST');
const faktor = require('../models/product/faktor');
const { Cookie } = require('tough-cookie');
const ordersLogs = require('../models/orders/ordersLogs');
const CheckChange = require('../middleware/CheckChange');
const sendSmsUser = require('../middleware/sendSms');
const CreateNotif = require('../middleware/CreateNotif');
const { ONLINE_URL,RAHKARAN_URL} = process.env;
 
router.get('/main', async (req,res)=>{
    try{
        const sliders = await slider.find()

        //logger.warn("main done")
        res.json({sliders:sliders})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.use('/auth', authApi)
router.use('/task', taskApi)
router.use('/setting', settingApi)
router.use('/app', appApi)
router.use('/cart', cartApi)
router.use('/product', productApi)
router.use('/form', formApi)
router.use('/user', userApi)
router.use('/payment',paymentApi)

router.use('/yas', yasApi)
router.use('/panel/user', panelUserApi)
router.use('/panel/order', panelOrderApi)
router.use('/panel/product', panelProductApi)
router.use('/panel/faktor', panelFaktorApi)
router.use('/esale', esaleApi)

router.use('/panel/crm',CRMPanelApi)
schedule.scheduleJob('5 */2 * * *', async() => { 
    response = await fetch(ONLINE_URL+"/get-product",
        {method: 'GET'});
 })
 schedule.scheduleJob('*/10 * * * *', async() => { 
    console.log("refreshing")
    response = await fetch(ONLINE_URL+"/get-faktors-auth",
        {method: 'GET'});
    response = await fetch(ONLINE_URL+"/get-faktors",
        {method: 'GET'});
    response = await fetch(ONLINE_URL+"/get-customers",
        {method: 'GET'});
 })
router.get('/auth-server', async (req,res)=>{
    try{
        const loginResult = await RahkaranLogin()
        var cookieSGPT = '';
        if(loginResult){
            cookieSGPT = loginResult.split('SGPT=')[1]
            cookieSGPT = cookieSGPT.split(';')[0]
        }
        console.log(cookieSGPT)
        res.cookie("sg-dummy","-")
        res.cookie("sg-auth-SGPT",cookieSGPT)
        res.json({result:loginResult,
            message:"احراز هویت انجام شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}) 

router.post('/set-cookie', async (req,res)=>{
    res.cookie("name","data Sample Here")
    res.send("Cookie set")

})
router.get('/get-cookie', async (req,res)=>{
    const cookieData = req.cookies
    res.send(cookieData)

})
router.post('/get-product', async (req,res)=>{
    const cookieData = req.cookies
    var sepidarResultRaw =[]
    try{
        sepidarResultRaw = await RahkaranPOST("/Sales/ProductManagement/Services/ProductManagementService.svc/GetProducts",
        {"PageSize":5},cookieData)
        const query=[]
        console.log(sepidarResultRaw)
        var newProduct = [];
        var updateProduct = 0
        var notUpdateProduct = 0
        var unitIds = []
        var sepidarResult=sepidarResultRaw&&sepidarResultRaw.result
        for(var i=0;i<sepidarResult.length;i++){
            var product = sepidarResult[i]
            var unitId = product.units&&product.units[0]&&product.units[0].unitRef
            unitIds.push(unitId)
            var productQuery={
                title:  product.name,
                sku: product.number,
                unitId:unitId,
                ItemID:product.id,
                active:product.stateTitle=="فعال"?true:false,
                rahcatId:product.partNature, 
                catTitle:product.partNatureTitle
            }
            const productResult = await products.updateOne({
                ItemID:product.id},{$set:productQuery})
        
            var modified = productResult.modifiedCount
            var matched = productResult.matchedCount
            if(matched){ notUpdateProduct++}
            if(modified){updateProduct++}
            if(!matched){
            const createResult = await products.create(
                productQuery
            )
                newProduct.push(productQuery.sku)
            }
        }
        
        await updateLog.create({
            updateQuery: "sepidar-product" ,
            date:Date.now()
        })
        res.json({sepidar:{new:newProduct,update:updateProduct,notUpdate:notUpdateProduct},
            unitIds:unitIds, raw:sepidarResultRaw,
            message:"محصولات بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/get-faktors-auth', async (req,res)=>{
    const loginResult = await fetch(ONLINE_URL+"/auth-server",
        {method: 'GET'});
    console.log(loginResult)
    await fetch(ONLINE_URL+"/get-faktors",
        {method: 'GET'}); 
})
router.get('/get-faktors', async (req,res)=>{
    const cookieData = req.cookies
    
    try{
        var faktorList = await faktor.find({status:{$in:["ثبت شده","ویرایش شده","تایید شده","لغو شده"]}})
        var rahkaranOut=[]
        var rahkaranItemOut=[]
        for(var i=0;i<faktorList.length;i++){
            var sepidarResult = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotations",
            {"MasterEntityID":faktorList[i].InvoiceID,"PageSize":5,},cookieData)
            if(!sepidarResult) {
                const loginData = await RahkaranLogin()
                var cookieSGPT = '';
                if(loginData){
                    cookieSGPT = loginData.split('SGPT=')[1]
                    cookieSGPT = cookieSGPT.split(';')[0]
                }
            // console.log(cookieSGPT)
                res.cookie("sg-dummy","-")
                res.cookie("sg-auth-SGPT",cookieSGPT)
                sepidarResult = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotations",
                {"MasterEntityID":faktorList[i].InvoiceID,"PageSize":5,},{"sg-auth-SGPT":cookieSGPT})

            }
            if(sepidarResult)
                rahkaranOut.push(sepidarResult.result[0])
            else{}
                //console.log(sepidarResult)
            var sepidarItemResult = await RahkaranPOST("/Sales/OrderManagement/Services/OrderManagementService.svc/GetQuotationItems",
            {"MasterEntityID":faktorList[i].InvoiceID,"PageSize":30,},cookieData)
            rahkaranItemOut.push(sepidarItemResult)
            const checkChangeItems = await CheckChange(faktorList[i].InvoiceID,sepidarItemResult)
            if(checkChangeItems){
                await ordersLogs.create({status:"ویرایش شده",orderNo:rahkaranOut[i].ID,
                description:checkChangeItems
                })
                await faktor.updateOne({InvoiceID:rahkaranOut[i].ID},
                    {$set:{status:"ویرایش شده",isEdit:true}}
                )
                await CreateNotif(faktorList[i].InvoiceID,faktorList[i].userId,"ویرایش سفارش ")
                await sendSmsUser(faktorList[i].userId,process.env.OrderEdit,
                    faktorList[i].InvoiceID)    
            }
        }
        for(var i=0;i<rahkaranOut.length;i++){
            if(rahkaranOut[i]&&rahkaranOut[i].State == 2){
                await ordersLogs.create({status:"تایید شده",orderNo:rahkaranOut[i].ID})
                await faktor.updateOne({InvoiceID:rahkaranOut[i].ID},
                    {$set:{status:"تایید شده",isEdit:false}}
                )
                await CreateNotif(faktorList[i].InvoiceID,faktorList[i].userId,"تایید سفارش ")
            }
            if(rahkaranOut[i]&&rahkaranOut[i].State == 6){
                
                const result = await ordersLogs.create({status:"باطل شده",orderNo:rahkaranOut[i].ID})
                await faktor.updateOne({InvoiceID:rahkaranOut[i].ID},
                    {$set:{status:"باطل شده",active:false,isEdit:false}}
                )
                await CreateNotif(faktorList[i].InvoiceID,faktorList[i].userId,"لغو سفارش ")
                //console.log(result)
            }
        }
        res.json({mainResult:rahkaranOut,itemResult:rahkaranItemOut})
        return
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/get-customers', async (req,res)=>{
    const cookieData = req.cookies
    var loginStatus=false
    var loginData = ''
    try{
        var sepidarResult = await RahkaranPOST("/Sales/PartyManagement/Services/PartyManagementService.svc/GetCustomerList",
        {"PageSize":1500},cookieData)
        if(!sepidarResult) {
            loginData = await RahkaranLogin()
            var cookieSGPT = '';
            if(loginData){
                cookieSGPT = loginData.split('SGPT=')[1]
                cookieSGPT = cookieSGPT.split(';')[0]
            }
        // console.log(cookieSGPT)
            res.cookie("sg-dummy","-")
            res.cookie("sg-auth-SGPT",cookieSGPT)
            //console.log(`sg-auth-SGPT=${cookieSGPT}`)
            loginStatus=true
            sepidarResult =RahkaranPOST("/Sales/PartyManagement/Services/PartyManagementService.svc/GetCustomerList",
            {"PageSize":1500},{"sg-auth-SGPT":cookieSGPT})
        }
        const query=[]
        var newCustomer = [];
        var updateCustomer = 0
        var notUpdateCustomer = 0
        for(var i=0;i<(sepidarResult.result&&sepidarResult.result.length);i++){
            var customer = sepidarResult.result[i]
            //console.log(customer)
            var phone = customer.Tel
            try{
                if(!phone) phone =customer.Addresses[0].Tel
            }
            catch{}
            var customerQuery={
                username: customer.DLCode,
                cName: customer.CompanyName?customer.CompanyName:
                    (customer.FirstName+ " " + customer.LastName),
                sName:customer.LastName,
                phone: phone,
                password: "123", 
                rahPartyType:customer.PartyType,
                rahStatus:customer.Status,
                rahType:customer.Type,
                mobile:customer.Mobile,
                email: customer.ID+"@202.com",
                access:"customer",
                meliCode:customer.NationalID,
                customerID:customer.ID,
                Address:customer.Addresses&&customer.Addresses[0]&&
                    customer.Addresses[0].Details,
                cityId:customer.Addresses&&customer.Addresses[0]&&
                customer.Addresses[0].CityRef
            }
            const customerResult = await customers.updateOne({
                customerID:customer.ID},{$set:customerQuery})
        
            var modified = customerResult.modifiedCount
            var matched = customerResult.matchedCount
            if(matched){ notUpdateCustomer++}
            if(modified){updateCustomer++}
            if(!matched){
            const createResult = await customers.create(
                customerQuery
            )
            newCustomer.push(customerQuery.customerID)
            }
        }
        
        await updateLog.create({
            updateQuery: "sepidar-customer" ,
            date:Date.now()
        })
        res.json({sepidar:{new:newCustomer.length,
            update:updateCustomer,
            notUpdate:notUpdateCustomer},
            result:sepidarResult.length,
            loginStatus:loginData,
            message:"کاربران بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-customer', async (req,res)=>{
    const url=req.body.url
    try{
        const sepidarResult = await sepidarFetch("data","/api/Customers")
 
        if(sepidarResult.error||!sepidarResult.length){
            res.json({error:"error occure",
                data:sepidarResult,message:"خطا در بروزرسانی"})
            return
        }
        var newCustomer = 0;
        var updateCustomer = 0
        var notUpdateCustomer = 0
        
    for(var i = 0;i<sepidarResult.length;i++){
        const custResult = await customers.updateOne({
            phone:sepidarResult[i].PhoneNumber,
            meliCode:sepidarResult[i].NationalID
        },{$set:{
            username: sepidarResult[i].Title,
            cName: sepidarResult[i].Name,
            sName: sepidarResult[i].LastName,
            meliCode: sepidarResult[i].NationalID,
            email: sepidarResult[i].Code+"@sharifoilco.com",
            access:"customer",
            cCode:sepidarResult[i].Code,
            CustomerID:sepidarResult[i].CustomerID,
            AddressID:(sepidarResult[i].Addresses&&sepidarResult[i].Addresses[0])?
                sepidarResult[i].Addresses[0].CustomerAddressID:'',
            Address:(sepidarResult[i].Addresses&&sepidarResult[i].Addresses[0])?
                sepidarResult[i].Addresses[0].Address:'',
            PostalCode:(sepidarResult[i].Addresses&&sepidarResult[i].Addresses[0])?
            sepidarResult[i].Addresses[0].ZipCode:''
        }})
        var modified = custResult.modifiedCount
        var matched = custResult.matchedCount
        if(matched){ notUpdateCustomer++}
        if(modified){updateCustomer++}
        if(!matched){
            await customers.create({
                username: sepidarResult[i].Title,
                cName: sepidarResult[i].Name,
                sName: sepidarResult[i].LastName,
                phone: sepidarResult[i].PhoneNumber,
                meliCode: sepidarResult[i].NationalID,
                email: sepidarResult[i].Code+"@sharifoilco.com",
                access:"customer",
                cCode:sepidarResult[i].Code,
                CustomerID:sepidarResult[i].CustomerID,
                AddressID:(sepidarResult[i].Addresses&&sepidarResult[i].Addresses[0])?
                    sepidarResult[i].Addresses[0].CustomerAddressID:'',
                Address:(sepidarResult[i].Addresses&&sepidarResult[i].Addresses[0])?
                    sepidarResult[i].Addresses[0].Address:'',
                PostalCode:(sepidarResult[i].Addresses&&sepidarResult[i].Addresses[0])?
                sepidarResult[i].Addresses[0].ZipCode:'',
                date:new Date()})
            newCustomer++

        }
    }
        
        await updateLog.create({
            updateQuery: "sepidar-customer" ,
            date:Date.now()
        })
        res.json({sepidar:{
            newCustomer:newCustomer,
            updateCustomer:updateCustomer,
            notUpdateCustomer:notUpdateCustomer
        },message:"کاربران بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-price', async (req,res)=>{
    try{
        const sepidarPriceResult = await sepidarFetch("data","/api/PriceNoteItems")
        if(sepidarPriceResult.error||!sepidarPriceResult.length){
            res.json({error:"error occure",
                data:sepidarPriceResult,message:"خطا در بروزرسانی"})
            return
        }
        //var successItem=[];
        //var failure = 0;
        await productPrice.deleteMany({})
        for(var i = 0;i<sepidarPriceResult.length;i++){
            //sepidarPriceResult[i].SaleTypeRef===5&& 
            await productPrice.create({
                pID:sepidarPriceResult[i].Code,
                saleType:sepidarPriceResult[i].SaleTypeRef,
                price:sepidarPriceResult[i].Fee?(parseInt(sepidarPriceResult[i].Fee)):0,
                ItemID:sepidarPriceResult[i].ItemRef,
                date:new Date()})
                
        }
        
        await updateLog.create({
            updateQuery: "sepidar-price" ,
            date:Date.now()
        })
        res.json({sepidar:sepidarPriceResult.length,message:"قیمت ها بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-bank', async (req,res)=>{
    const url=req.body.url
    try{
        const sepidarBankResult = await sepidarFetch("data","/api/BankAccounts")
        if(sepidarBankResult.error||!sepidarBankResult.length){
            res.json({error:"error occure",
                data:sepidarBankResult,message:"خطا در بروزرسانی"})
            return
        }
        //var successItem=[];
        //var failure = 0;
        0&&await bankAccounts.deleteMany({})
        for(var i = 0;i<sepidarBankResult.length;i++){
            //sepidarPriceResult[i].SaleTypeRef===5&& 
            0&&await bankAccounts.create({
                BankAccountID:sepidarBankResult[i].BankAccountID,
                DlCode:sepidarBankResult[i].DlCode,
                DlTitle:sepidarBankResult[i].DlTitle,
                CurrencyRef:sepidarBankResult[i].CurrencyRef})
                
        }
        await updateLog.create({
            updateQuery: "sepidar-bank" ,
            date:Date.now()
        })
        res.json({sepidar:sepidarBankResult.length,
            data:sepidarBankResult,message:"غیر فعال است"})//"بانک ها بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-quantity', async (req,res)=>{
    try{
        const sepidarQuantityResult = await sepidarFetch("data","/api/Items/Inventories")

        if(sepidarQuantityResult.error||!sepidarQuantityResult.length){
            res.json({error:"error occure",
                data:sepidarQuantityResult,message:"خطا در بروزرسانی"})
            return
        }
        //var successItem=[];
        //var failure = 0;
        await productCount.deleteMany({})
        for(var i = 0;i<sepidarQuantityResult.length;i++){
            if(sepidarQuantityResult[i].UnitRef!==3)
            await productCount.create({
                quantity:sepidarQuantityResult[i].Qunatity,
                UnitRef:sepidarQuantityResult[i].UnitRef,
                Stock:sepidarQuantityResult[i].StockeRef,
                ItemID:sepidarQuantityResult[i].ItemRef,
            date:new Date()})
            else{
                if(sepidarQuantityResult[i].StockeRef!==5)continue
                var perBox = 1
                var singleItem = await sepidarQuantityResult.find
                    (item=>(item.ItemRef===sepidarQuantityResult[i].ItemRef&&
                        item.UnitRef==1&&item.StockeRef==5))
                if(sepidarQuantityResult[i].Qunatity)
                    perBox =(singleItem&&singleItem.Qunatity)/
                        sepidarQuantityResult[i].Qunatity
                
                var intBox =0
                try{intBox=(parseInt(Math.round(perBox)))} catch{}
                if(perBox!==1&&intBox!==0)await products.updateOne({
                    ItemID:sepidarQuantityResult[i].ItemRef,
                },{$set:{perBox:intBox}})
            }
        }
        
        await updateLog.create({
            updateQuery: "sepidar-quantity" ,
            date:Date.now()
        })
        res.json({sepidar:sepidarQuantityResult.length,message:"تعداد بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-all', async (req,res)=>{
    try{
        response = await fetch(ONLINE_URL+"/sepidar-product",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-price",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-quantity",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-customers",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-bank",
            {method: 'GET'});
        res.json({message:"تمامی جدول ها بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-update-log', async (req,res)=>{
    try{ 
        const sepidarLog = await updateLog.find({}).sort({"date":-1})
        
        res.json({log:sepidarLog,message:"done"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;