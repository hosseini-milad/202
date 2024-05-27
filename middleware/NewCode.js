
const faktor = require("../models/product/faktor");

const NewCode=async(userNo,dateYear)=>{
    var rxTemp = '';
    while(1){
        
        const foundRx = rxTemp&&await faktor.findOne({faktorNo:rxTemp});
        if(rxTemp&&!foundRx)break
        else rxTemp=userNo+
            (Math.floor(Math.random() * 10000) + 1000)
    }
    return(rxTemp)

}
module.exports =NewCode