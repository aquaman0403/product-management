const Chat = require("../../models/chat.model")

module.exports = async (res) => {
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

    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      })
    })
  })
}