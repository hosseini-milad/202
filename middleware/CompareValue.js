const CompareValue=(value1,value2)=>{
    if(!value1){
        if(!value2) return true
        if(value2=="0") return true
    }
    if(value1=="0"){
        if(!value2) return true
        if(value2=="0") return true
    }
    if(value1==value2) return true
    return false
}

module.exports =CompareValue