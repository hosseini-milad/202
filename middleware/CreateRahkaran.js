const ProfileAccess = require("../models/auth/ProfileAccess");
const customers = require("../models/auth/customers");

var ObjectID = require('mongodb').ObjectID;

const CreateRahkaran=async(data)=>{
    const userData = await customers.findOne({_id:ObjectID(data.userId)})
    var items = []
    for(var i=0;i<data.cartItems.length;i++)
        items.push(
            {
                "description":null,
                    "index":i,
                    "productId":data.cartItems[i].id,
                    "quantity":data.cartItems[i].count,
                    "salesAreaId":"1",
                    "unitId":"7",
                    "additionAmount":"0",
                    "fee":"750000",
                    "freeProductPolicyConditionRowId":null,
                    "freeProductPolicyId":null,
                    "netPrice":"75000",
                    "parentItemIndex":null,
                    "price":"750000",
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
            "date":`/Date(${data.progressDate})/`,
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
            "netPrice":"750000",
            "policyResults":[],
            "price":"740000",
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