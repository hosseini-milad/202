const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
const auth = require("../middleware/auth");

const checkExistance=async(orderList)=>{
    
    return(0)
}


module.exports = router;