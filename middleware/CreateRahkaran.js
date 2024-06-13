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
                    "salesAreaId":"2",
                    "unitId":faktorItems[i].unitId,//7
                    "additionAmount":NormalTax(MultiPrice(faktorItems[i].price,faktorItems[i].count)),
                    "fee":faktorItems[i].price?faktorItems[i].price:"740000",
                    "freeProductPolicyConditionRowId":null,
                    "freeProductPolicyId":null,
                    "netPrice":faktorItems[i].price?faktorItems[i].price:"740000",
                    "parentItemIndex":null,
                    "price":faktorItems[i].price?faktorItems[i].price:"740000",
                    "reductionAmount":"0",
                    "type":1,
                    "inventoryID":null,
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
            "inventoryId":"13",
            "items":items,
            "payerType":1,
            "payerTypeTitle": "مشتری",
            "paymentAgreementId":3,
            "plantId":"8",
            "salesAreaId":10002,
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

    return(postData)
}
module.exports =CreateRahkaran