const { default: fetch } = require("node-fetch");
var rsa = require("node-bignumber");
var tough = require("tough-cookie");
var Cookie = tough.Cookie;

const { RAHKARAN_URL, RAHKARAN_USER, RAHKARAN_PASS,
    RAHKARAN_SESSION,RAHKARAN_LOGIN} = process.env;

const RahkaranLogin=async()=>{
    var sessionResponse = ''; 
    var loginResponse = ''; 
    var tokenData = ''
    try{    sessionResponse = await fetch(RAHKARAN_URL+RAHKARAN_SESSION,
            {method: 'GET' });
        const result = await sessionResponse.json();
        var passData = await createPassword(result)

        var loginQuery=
            {
                "username":RAHKARAN_USER,
                "password":passData,
                "sessionId":result.id
            }
        var cookieValue = ''
        loginResponse = await fetch(RAHKARAN_URL+RAHKARAN_LOGIN,
            {method: 'POST' ,headers:{"Content-Type":"application/json"},
            body:JSON.stringify(loginQuery)})
            .then(res => {
                const authHeaders = ['set-cookie']
                  .reduce((result, key) => {
                    let val = res.headers.get(key);
                    if (val) {
                      result[key] = val;
                    }
                    cookieValue = (val)
                  }, {});
                  
              })
              //var cookies = await cookiejar.getCookies("https://example.com/otherpath");
            //console.log(cookieValue)
        return(cookieValue)
    }
    catch(error){ 
        return({error:sessionResponse,
            error_description:loginResponse})
    }
  }

const createPassword=async(session)=>{
    if(!session.rsa) return('')
    var n = session.rsa.M;
    var e = session.rsa.E;
    var pub = new rsa.Key();
    pub.setPublic(n, e);
    var message = session.id+"**"+RAHKARAN_PASS;
    var encrypted = pub.encrypt(message);
    return(encrypted)
}
module.exports =RahkaranLogin