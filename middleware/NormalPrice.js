
const NormalPrice=(priceText,count)=>{
        if(!priceText||priceText === null||priceText === undefined) return("")
        if(!count) count = 1
        var priceNeg = false
        if(priceText&&priceText.toString().includes('-')) priceNeg=true
        try{priceText =priceText.split(' ')[0];}catch{}
        if(priceText === "0"||priceText === 0)return("0");
        var rawPrice = parseInt(priceText.toString().replace(/\D/g,''))*count
        rawPrice = Math.round(rawPrice/1000) * 1000
        //console.log(rawPrice,priceText)
        return((priceNeg?"-":"")+
          (rawPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace( /^\D+/g, ''))
        )
}

module.exports =NormalPrice