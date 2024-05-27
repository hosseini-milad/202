const { default: fetch } = require("node-fetch");
var tough = require("tough-cookie");
const RahkaranLogin = require("./RahkaranLogin");
var Cookie = tough.Cookie;
const { RAHKARAN_URL} = process.env;

const RahkaranPOST=async(url,data,cookie)=>{
    var cookieData = CookieToText(cookie)
    if(!cookieData){
        
        return('')
    }
    //console.log(cookie)
    var response = ''; 
    const postOptions = {
        credentials: 'include',
        method: 'POST' ,body:JSON.stringify(data),
        headers:{"Content-Type":"application/json",
        cookie:cookieData}
    }
    //console.log(postOptions)
    try{    
        response = await fetch(RAHKARAN_URL+url,postOptions);
        const status = response.status
        const result = await response.json();
        return({status:status,result})
    }
    catch(error){ 
        console.log(error)
        return('')
    }
  }
function CookieToText(cookie){
    if(!cookie['sg-auth-SGPT']) return('')
    var out = ''
    out = `sg-auth-SGPT=${cookie['sg-auth-SGPT']}`
    return(out)
}
module.exports =RahkaranPOST