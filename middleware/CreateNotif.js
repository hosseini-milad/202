const notif = require("../model/Params/notif")


const CreateNotif = async(data,user,type,linkRaw)=>{
    var link = linkRaw?linkRaw:"#"
    await notif.create({
        title:type+data,
        orderNo:data,
        userId:user,
        status:1,
        content: "",
        link:link,
        imageUrl: "",
    })
    return({message:"Notif Created"})
}

module.exports =CreateNotif