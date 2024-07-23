const PN = require("persian-number");
const PersianNumber=(number)=>{
    if(!number||number === null||number === undefined) return("")
    var rawNumber = parseInt(number.toString().replace(/\D/g,''))
    var pNumber = PN.convert(Math.round(rawNumber/1000) * 1000);
  return(pNumber)
}

module.exports =PersianNumber