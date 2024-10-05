const faktor = require("../models/product/faktor")
const faktorItem = require("../models/product/faktorItem")
const units = require("../models/product/units")
const NormalPrice = require("./NormalPrice")
const PersianNumber = require("./PersianNumber")

var pdf = require("pdf-creator-node")
var fs = require('fs');
const customers = require("../models/auth/customers")
const products = require("../models/product/products")
const CalcWeight = require("./CalcWeight")
 
const CreateFaktor = async(rahId)=>{
    const orderData = await faktor.findOne({rahId:rahId}).lean()
  if(!orderData){
    return('not found')
  }
  const orderList = await faktorItem.aggregate([
    {$match:{faktorNo:orderData.faktorNo}},
    {$lookup:{from : "products", 
      localField: "sku", foreignField: "sku", as : "detail"}}
  ])
  var totalWeight=0
  for(var i=0;i<orderList.length;i++){
    const unitData = await units.findOne({id:orderList[i].detail[0].unitId})
    const productData = orderList[i].detail[0]
    orderList[i].unit = unitData&&unitData.title
    orderList[i].weight = productData.weight
    try{
      var tWeight = CalcWeight(productData.weight,
      orderList[i].count)
      orderList[i].totalWeight = tWeight
      totalWeight+=tWeight
    }catch{}
    orderList[i].index = i+1
    orderList[i].title = orderList[i].detail[0].title
    orderList[i].price = NormalPrice(orderList[i].price)
    orderList[i].totalPrice = NormalPrice(orderList[i].totalPrice)
  }
  
  orderData.pPrice = PersianNumber(orderData.netPrice)
  orderData.totalPrice = NormalPrice(orderData.totalPrice)
  orderData.netPrice = NormalPrice(orderData.netPrice)
  orderData.totalWeight = totalWeight
  orderData.totalAddition = NormalPrice(orderData.totalAddition)
  orderData.totalDiscount = NormalPrice(orderData.totalDiscount)
  const userData = await customers.findOne({customerID:orderData.customerID}).lean()
  
  //try { 
        var html = fs.readFileSync("./uploads/template.html", "utf8");
        var options = { format: "A4", orientation: "portrate", border: "5mm" };
        var date = new Date(orderData.initDate)
        var document = {
            html: html, 
            data: {
              items:orderList,
              order:[orderData],
              user:[userData],
              date:[date.toLocaleDateString('fa')]
            }, 
            path: `./uploads/faktors/faktor${rahId}.pdf`
        };
        await pdf.create(document, options)
        .then(async(res) =>{
            var filePath = res.filename.split('/uploads')[1]
            filePath = process.env.DOWN_URL + "/uploads"+filePath
            await faktor.updateOne({rahId:rahId},{$set:{faktorUrl:filePath}})
            return(filePath)
        })
        .catch(error => {
          console.log(error)
            return(error)
        });
        return(document.path)
 //    } 
  //catch(error){
  //  return("error catch")
  //}
}

module.exports =CreateFaktor