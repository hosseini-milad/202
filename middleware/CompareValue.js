const CompareValue=async(value1,value2)=>{
    console.log("compare: "+value1+", "+value2)
    if(!value1){
        if(!value2) return true
        if(value2=="0") return true
    }
    if(value1=="0"){
        if(!value2) return true
        if(value2=="0") return true
    }
    if(value1==value2) return true
    console.log("false")
    return false
}

module.exports =CompareValue