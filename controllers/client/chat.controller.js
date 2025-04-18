const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName

    _io.once("connection", (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (message) => {
            const chat = new Chat({
                user_id: userId,
                content: message
            })

            await chat.save()

            // Emit the message to all connected clients
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: message,
            })
        })
    })

    const chats = await Chat.find({ deleted: false })

    for (const chat of chats) {
        const infoUser = await User.findById(chat.user_id).select("fullName")
        chat.infoUser = infoUser
    }
    

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats,
    })
}