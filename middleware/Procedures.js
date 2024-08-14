const sql = require('mssql')
const Procedures = async(customerId,sdate,edate)=>{
  const config = {
      user: 'SPUser',
      password: 'matini@SP',
      server: '10.10.4.23',
      database: 'SGPT_sg3',
      options: {
          trustedConnection: true,
          trustServerCertificate: true
      }
  }
  try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect(config)
      const request = new sql.Request()
      request.input('sdate', sql.DateTime, sdate)
      request.input('edate', sql.DateTime, edate)
      request.input('customerId', sql.NVarChar, customerId)
      const result = await request.execute('dbo.GetVoucherFullInfo')
      return(result)
  } catch (err) {
      return(err)
  }
}

module.exports =Procedures