var tax = process.env.TaxRate

const MultiPrice=(price1,price2)=>{
    if(!price1||!price2) return(0)
    const price1Float = parseFloat(price1)
    const price2Float = parseFloat(price2)
    const newPrice = price1Float*price2Float
    const RoundPrice = Math.round(newPrice)
    return(parseInt(RoundPrice))
}

module.exports =MultiPrice