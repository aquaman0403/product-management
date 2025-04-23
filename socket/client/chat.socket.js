const Chat = require("../../models/chat.model")


module.exports = async (req, res) => {

  const userId = res.locals.user.id
  const fullName = res.locals.user.fullName
  const roomChatId = req.params.roomChatId

  _io.once("connection", (socket) => {
    socket.join(roomChatId)

    socket.on("CLIENT_SEND_MESSAGE", async (message) => {
      const chat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: message
      })

      await chat.save()

      // Emit the message to all connected clients
      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: message,
      })
    })

    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      })
    })
  })
}