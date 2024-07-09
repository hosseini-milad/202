const MultiPrice = require("./MultiPrice")
const NormalTax = require("./NormalTax")

const CreateRahkaran=async(faktorData,faktorItems,userData)=>{
    
    var items = []
    for(var i=0;i<faktorItems.length;i++)
        items.push(
            {
                "description":null,
                    "index":i,
                    "productId":faktorItems[i].ItemID,
                    "quantity":faktorItems[i].count,
                    "salesAreaId":"4",
                    "unitId":faktorItems[i].unitId,//7
                    "additionAmount":NormalTax(MultiPrice(faktorItems[i].price,faktorItems[i].count)),
                    "fee":"1",//faktorItems[i].price?faktorItems[i].price:"740000",
                    "freeProductPolicyConditionRowId":null,
                    "freeProductPolicyId":null,
                    "netPrice":"1",//faktorItems[i].price?faktorItems[i].price:"740000",
                    "parentItemIndex":null,
                    "price":"1",//faktorItems[i].price?faktorItems[i].price:"740000",
                    "reductionAmount":"0",
                    "type":1,
                    "inventoryID":10001,
                    "plantID":null,
                    "productPackItemRef":null,
                    "productPackQuantity":"0",
                    "productPackRef":null,
                    "referenceID":null,
                    "referenceType":null,
                    "shippingPointID":null}
    )
    const postData = 
        {
            "addressId":"",
          "brokerId":62,
            "currencyId":"1",
            "customerId":userData.customerID,
            "date":`/Date(${faktorData.progressDate})/`,
            "description":null,
            "id":"-1",
            "inventoryId":10001,
            "items":items,
            "payerType":1,
            "payerTypeTitle": "مشتری",
            "paymentAgreementId":3,
            "plantId":"8",
            "salesAreaId":4,
            "salesOfficeId":"10001",
            "salesTypeId":"6",
            "additionAmount":"0",
            "netPrice":faktorData.totalPrice,
            "policyResults":[],
            "price":faktorData.totalPrice,
            "reductionAmount":"0",
            "agentID":null,
            "oneTimeCustomerID":null,
            "recipientType":1,
            "state":1,
            "shippingPointID":null
    }
    console.log(postData)
    return(postData)
}
module.exports =CreateRahkaran