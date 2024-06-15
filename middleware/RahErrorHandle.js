const RahErrorHandle=(error)=>{
    if(!error) return(0)
    var errorOut = error.split("SgException:")[1]
    //const count = 0//parseFloat(count)
    errorOut = errorOut.split("at SystemGroup")[0]
    //const newPrice = priceFloat*count
    return(errorOut)
}

module.exports =RahErrorHandle