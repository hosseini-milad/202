var tax = process.env.TaxRate

const PriceCount=(price,count)=>{
    if(!price) return(0)
    const priceFloat = parseFloat(price)
    const count = parseFloat(count)
    const newPrice = priceFloat*count
    return(parseInt(newPrice))
}

module.exports =PriceCount