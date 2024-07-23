const notif = require("../model/Params/notif")


const CreateNotif = async(data,user,type)=>{
    await notif.create({
        title:type+data,
        orderNo:data,
        userId:user,
        status:1,
        content: "",
        link:"#",
        imageUrl: "",
    })
    return({message:"Notif Created"})
}

module.exports =CreateNotif