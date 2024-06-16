const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
var ObjectID = require('mongodb').ObjectID;
const auth = require("../middleware/auth");
const task = require('../models/main/task');
const LogCreator = require('../middleware/LogCreator');
const users = require('../models/auth/users');
const slider = require('../models/main/slider');
const notif = require('../model/Params/notif');
const docCat = require('../model/Params/docCat');
const docSchema = require('../model/Params/document');
const CreateMock = require('../middleware/CreateMocks');


router.post('/sliders', async (req,res)=>{
    try{
        const SlidersList = await slider.find()
        res.json({filter:SlidersList,message:"slider list"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/fetch-slider', async (req,res)=>{
    var sliderId = req.body.sliderId?req.body.sliderId:''
    try{
        const SliderData = await slider.findOne({_id:sliderId})
        res.json({filter:SliderData,message:"slider Data"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/updateSlider',auth,jsonParser, async (req,res)=>{
    var sliderId = req.body.sliderId?req.body.sliderId:''
    if(sliderId === "new")sliderId=''
    try{ 
        const data = {
            title:  req.body.title,
            enTitle:  req.body.enTitle,
            link: req.body.link,
            description:   req.body.description,
            imageUrl: req.body.imageUrl,
            thumbUrl:req.body.thumbUrl
        }
        var sliderResult = ''
        if(sliderId) sliderResult=await slider.updateOne({_id:sliderId},
            {$set:data})
        else
        sliderResult= await slider.create(data)
        
        res.json({result:sliderResult,success:sliderId?"Updated":"Created"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/changeState',auth,jsonParser, async (req,res)=>{
    const data={
        state:req.body.state,
        prior:req.body.prior*5+1
    }
    try{
        const userData = await users.findOne({_id:req.headers['userid']})

    const logData = await LogCreator(userData,"change State",
        `task no ${req.body.id}'s state change to ${data.state}`)
        const leadTask= await task.updateOne({_id:req.body.id},
            {$set:data})
        //if(leadTask)
        res.json({status:"report done",data:leadTask})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/changeOrder',auth,jsonParser, async (req,res)=>{
    const tasks = req.body.tasks
    try{
        const userData = await users.findOne({_id:req.headers['userid']})

        const logData = await LogCreator(userData,"change Sort",
        `task sort by: ${tasks}`)
    
   for(var i = 0;i<tasks.length;i++){
    const updateState = await task.updateOne({_id:tasks[i]},{$set:{prior:i*5+3}})
    }
       
        //if(leadTask)
        res.json({status:"sort done"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


/*Document*/
router.post('/list-doc',jsonParser,async (req,res)=>{
    try{
        var result = await docSchema.find();
       
        res.json({filter:result})
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.get('/list-mocks',jsonParser,async (req,res)=>{
    try{
        var documents = await docSchema.find();
        var docCats = await docCat.find();
        const mocks = await CreateMock(docCats,documents)
        res.json(mocks)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/fetch-doc',jsonParser,async (req,res)=>{
    const docId = req.body.docId
    try{
        var result = docId?await docSchema.findOne({_id:ObjectID(docId)}):'';
        res.json(result)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.post('/update-doc',jsonParser,async (req,res)=>{
    var docId = req.body.docId
    if(docId==="new") docId = ""
    const data = req.body

    try{
        var result = docId?await docSchema.updateOne({_id:ObjectID(docId)},{$set:data}):
        await docSchema.create(data);
        res.json(result)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/delete-doc',jsonParser,auth,async (req,res)=>{
    var docId = req.body.docId
    if(!docId) {
        res.status(400).json({message:"not found"})
        return
    }

    try{
        var result = await docSchema.deleteOne({_id:ObjectID(docId)})
        res.json(result)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.post('/list-notif',jsonParser,async (req,res)=>{
    try{
        var result = await notif.find();
       
        res.json({filter:result})
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.post('/fetch-notif',jsonParser,async (req,res)=>{
    const notifCode = req.body.notifCode
    try{
        var result = notifCode?await notif.findOne({enTitle:notifCode}):'';
        res.json(result)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.post('/update-notif',jsonParser,async (req,res)=>{
    var notifCode = req.body.notifCode
    if(notifCode==="new") notifCode = ""
    const data = req.body

    try{
        var result = notifCode?await notif.updateOne({enTitle:notifCode},{$set:data}):
        await notif.create(data);
        res.json(result)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})


router.post('/list-news',jsonParser,async (req,res)=>{
    try{
        var result = await notif.find();
       
        res.json({filter:result})
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.post('/fetch-news',jsonParser,async (req,res)=>{
    const notifCode = req.body.notifCode
    try{
        var result = notifCode?await notif.findOne({enTitle:notifCode}):'';
        res.json(result)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

router.post('/update-news',jsonParser,async (req,res)=>{
    var notifCode = req.body.notifCode
    if(notifCode==="new") notifCode = ""
    const data = req.body

    try{
        var result = notifCode?await notif.updateOne({enTitle:notifCode},{$set:data}):
        await notif.create(data);
        res.json(result)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/show-news',jsonParser,async (req,res)=>{
    var userId = req.headers["userid"]
    const notifCode = req.body.notifCode

    try{
        const notifResult = await notif.findOne({_id:ObjectID(notifCode)})
        if(!notifResult){
            res.status(400).json({message: "یافت نشد", error:"Not Found"}) 
            return
        }
        var result = await user.updateOne({_id:ObjectID(userId)},
            {$set:{showNotif:notifCode}})
        
        res.json(result)
        return
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})

module.exports = router;