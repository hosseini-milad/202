
const NormalPrice=(priceText,count)=>{
        if(!priceText||priceText === null||priceText === undefined) return("")
        if(!count) count = 1
        try{priceText =priceText.split(' ')[0];}catch{}
        if(priceText === "0"||priceText === 0)return("-");
        var rawPrice = parseInt(priceText.toString().replace(/\D/g,''))*count
        rawPrice = Math.round(rawPrice/1000) * 1000
        //console.log(rawPrice,priceText)
        return(
          (rawPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace( /^\D+/g, ''))
        )
}

module.exports =NormalPrice