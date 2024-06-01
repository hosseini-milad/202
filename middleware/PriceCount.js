var tax = process.env.TaxRate

const PriceCount=(price,count)=>{
    if(!price) return(0)
    const priceFloat = 0//parseFloat(price)
    const count = 0//parseFloat(count)
    const newPrice = priceFloat*count
    return(parseInt(newPrice))
}

module.exports =PriceCount