const { default: fetch } = require("node-fetch");
var tough = require("tough-cookie");
var Cookie = tough.Cookie;
const { RAHKARAN_URL} = process.env;

const RahkaranPOST=async(url,data,cookie)=>{
    var response = ''; 
    const postOptions = {
        credentials: 'include',
        method: 'POST' ,body:JSON.stringify(data),
        headers:{"Content-Type":"application/json",
        cookie:CookieToText(cookie)}
    }
    console.log(postOptions)
    try{    
        response = await fetch(RAHKARAN_URL+url,postOptions);
        //console.log(response)
        const result = await response.json();
        return(result)
    }
    catch(error){ 
        console.log(error)
        return(error)
    }
  }
function CookieToText(cookie){
    var out = ''
    out = `sg-auth-SGPT=${cookie['sg-auth-SGPT']}`
    return(out)
}
module.exports =RahkaranPOST