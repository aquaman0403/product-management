const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const chatSocket = require("../../socket/client/chat.socket")

module.exports.index = async (req, res) => {
    
    const chats = await Chat.find({ deleted: false })

    chatSocket(res)

    for (const chat of chats) {
        const infoUser = await User.findById(chat.user_id).select("fullName")
        chat.infoUser = infoUser
    }
    

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats,
    })
}