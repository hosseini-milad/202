const excel = require('node-excel-export');
const fs = require('fs');

// You can define styles as json object
const styles = {
      headerDark: {
        fill: {
          fgColor: {
            rgb: 'FF000000'
          }
        },
        font: {
          color: {
            rgb: 'FFFFFFFF'
          },
          sz: 14,
          bold: true,
          underline: true
        }
      },
      cellPink: {
        fill: {
          fgColor: {
            rgb: 'FFFFCCFF'
          }
        }
      },
      cellGreen: {
        fill: {
          fgColor: {
            rgb: 'FF00FF00'
          }
        }
      }
    };
     
    //Array of objects representing heading rows (very top)
    const heading = [
      ['radif', 'code', 'price'] // <-- It can be only values
    ];
     
    //Here you specify the export structure
    const specification = {
        
        radif: { // <- the key should match the actual data key
            displayName: "رديف", // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            
            width: 40 // <- width in pixels
        },
        date: { // <- the key should match the actual data key
            displayName: "تاریخ", // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            
            width: 130 // <- width in pixels
        },
        title: {
            displayName: 'شرح',
            headerStyle: styles.headerDark,
            
            width: 290 // <- width in chars (when the number is passed as string)
        },
        debit:{
            displayName: 'بدهکار',
            headerStyle: styles.headerDark,
            width: 190
        },
        credit:{
            displayName: 'بستانکار',
            headerStyle: styles.headerDark,
            width: 90,
        },
         remain:{
            displayName: 'مانده در خط',
            headerStyle: styles.headerDark,
            width: 190
        }
    }
    
     
    const merges = [
      //{ start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
      //{ start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
      //{ start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
    ]
     
    const exportExcelApi =async(data,id,downUrl)=>{
        const url = `uploads/invoices/invoice${id}.xlsx`
        
        
        var dataset = data.map((item,i)=>(
            {radif: i+1, date:item.dateFa, title: item.desc, 
            debit:item.credit, credit: item.debit, 
            remain: item.remain}
        ))
        try{fs.unlinkSync(url);}catch{}
        const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
            name: 'Report', // <- Specify sheet name (optional)
            //heading: heading, // <- Raw heading array (optional)
            merges: merges, // <- Merge cell ranges
            specification: specification, // <- Report specification
            data: dataset // <-- Report data
            }
        ]
        );
        fs.writeFile(url, report, function(err) {
            if(err) {
                return console.log(err);
            }
        }); 
        // You can then return this straight
        //res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
        return ("./"+url);
    }
    module.exports = exportExcelApi;