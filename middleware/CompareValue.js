const CompareValue=async(value1,value2)=>{
    console.log("value1: "+value1+" value2: "+value2)
    if(!value1){
        if(!value2) return true
        if(value2=="0") return true
    }
    if(value1=="0"){
        if(!value2) return true
        if(value2=="0") return true
    }
    if(value1==value2) return true
    console.log(value1+" - "+value2)
    return false
}

module.exports =CompareValue