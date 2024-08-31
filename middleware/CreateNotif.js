const notif = require("../model/Params/notif")


const CreateNotif = async(data,user,type,linkRaw,kind,thumb)=>{
    var link = linkRaw?linkRaw:"#"
    await notif.create({
        title:type+data,
        kind:kind,
        orderNo:data,
        userId:user,
        status:1,
        content: "",
        link:link,
        imageUrl: thumb,
    })
    return({message:"Notif Created"})
}

module.exports =CreateNotif