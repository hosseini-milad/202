const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { default: fetch } = require("node-fetch");
const jwt = require("jsonwebtoken");
var ObjectID = require('mongodb').ObjectID;
const auth = require("../middleware/auth");
const jsonParser = bodyParser.json();
const router = express.Router()
var fs = require('fs');
const faktor = require('../models/product/faktor');
const faktorItem = require('../models/product/faktorItem');
const customers = require('../models/auth/customers');
const { FORMERR } = require('dns');
const CreateFaktor = require('../middleware/CreateFaktor');
const CreateInvoice = require('../middleware/CreateInvoice');

router.post('/create-report',jsonParser, async (req,res)=>{
  const rahId = req.body.rahId
  const faktorUrl = await CreateFaktor(rahId)
  
  if(faktorUrl)
    res.json(faktorUrl)
  else
    res.status(400).json("error occure")
})

router.post('/create-invoice',jsonParser,auth, async (req,res)=>{
  const userId = req.headers['userid']
  const userData = await customers.findOne({_id:ObjectID(userId)})
  if(!userData.access||userData.access!=="full"){
    res.status(400).json({error:"دسترسی به این بخش ندارید"})
    return
}
  const dateFrom = req.body.dateFrom
  const dateTo = req.body.dateTo
  //console.log(userId)
  //try{
    const faktorUrl = await CreateInvoice(userId,dateFrom,dateTo)
  
  if(faktorUrl)
    res.json(faktorUrl)
  else
    res.status(400).json("error occure")
  //}catch(error){
    //res.status(500).json({error:error})
  //}
})
router.post('/remove-invoice',jsonParser,auth, async (req,res)=>{
  var filePath = `./uploads/invoices/invoice${req.body.source}.pdf`; 
  try{fs.unlinkSync(filePath);}catch{}
  res.json(filePath)
})


module.exports = router;