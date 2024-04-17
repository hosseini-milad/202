const { default: fetch } = require("node-fetch");

const { RAHKARAN_URL} = process.env;


const RahkaranGET=async(url)=>{
    var sessionData=''
    var response = ''; 
    try{    response = await fetch(RAHKARAN_URL+url,
            {method: 'GET' });
        const result =  response//.json();
        
        return({result:result})
    }
    catch(error){ 
        console.log(error)
        return(error)
    }
    return(sessionData)
  }
module.exports =RahkaranGET