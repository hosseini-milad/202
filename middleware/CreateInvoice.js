var pdf = require("pdf-creator-node")
var fs = require('fs');
const customers = require("../models/auth/customers")
const Procedures = require("./Procedures")
const exportExcelApi = require("./excelExport")
 
const CreateInvoice = async(userId,sdate,edate)=>{
  const downUrl = process.env.DOWN_URL
    const userData = await customers.findOne({_id:userId}).lean()

    if(!userData){
      return('not found')
    }
    
  var pureS = sdate?sdate.replace( /\//g, '-'):"1400-01-01"
  var pureE = edate?sdate.replace( /\//g, '-'):"1410-12-29"
  const result = await Procedures(userData.customerID,pureS,pureE)
  if(!result||!result.recordsets[0]){
    return('error')
  }
  const recordsets = result.recordsets[0]
  for(var i=0;i<recordsets.length;i++){
    recordsets[i].dateFa = new Date(recordsets[i].date).toLocaleDateString('fa')
    recordsets[i].index = i+1
  }
  const excelUrl = await exportExcelApi(recordsets,userData.customerID,downUrl)
        var html = fs.readFileSync("./uploads/templateInvoice.html", "utf8");
        var options = { format: "A4", orientation: "portrate", border: "5mm" };
        var date = new Date()
        var document = {
            html: html, 
            data: {
              items:recordsets,
              date:[date.toLocaleDateString('fa')]
            }, 
            path: `./uploads/invoices/invoice${userData.customerID}.pdf`
        };
        var finalPath = ''
        try{fs.unlinkSync(document.path);}catch{}
        await pdf.create(document, options)
        .then(async() =>{
            return(finalPath)
        })
        .catch(error => {
          console.log(error)
            return(error)
        });
        return({ baseUrl:downUrl,
          pdfUrl:document.path,
          xlsUrl:excelUrl, date:{start:pureS,end:pureE},
          data:recordsets,status:"done"})
 //    } 
  //catch(error){
  //  return("error catch")
  //}
}

module.exports =CreateInvoice