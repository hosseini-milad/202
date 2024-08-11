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
  const result = await Procedures(userData.customerID,sdate,edate)
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
        await pdf.create(document, options)
        .then(async(res) =>{
          var filePath = res.filename.split('/uploads')[1]
          filePath = process.env.DOWN_URL + "/uploads"+filePath
            
            return(finalPath)
        })
        .catch(error => {
          console.log(error)
            return(error)
        });
        return({pdfUrl:document.path,xlsUrl:excelUrl,data:recordsets,status:"done"})
 //    } 
  //catch(error){
  //  return("error catch")
  //}
}

module.exports =CreateInvoice