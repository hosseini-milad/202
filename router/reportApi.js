const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { default: fetch } = require("node-fetch");
const jwt = require("jsonwebtoken");
var ObjectID = require('mongodb').ObjectID;
const jsonParser = bodyParser.json();
const router = express.Router()
const faktor = require('../models/product/faktor');
const faktorItem = require('../models/product/faktorItem');
const customers = require('../models/auth/customers');
const { FORMERR } = require('dns');
const CreateFaktor = require('../middleware/CreateFaktor');

router.post('/create-report',jsonParser, async (req,res)=>{
  const rahId = req.body.rahId
  const faktorUrl = await CreateFaktor(rahId)
  
  if(faktorUrl)
    res.json(faktorUrl)
  else
    res.status(400).json("error occure")
})


module.exports = router;