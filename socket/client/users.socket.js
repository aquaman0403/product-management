const RoomChat = require("../../models/room-chat.model")
const User = require("../../models/user.model")

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id

      // Thêm id của A vào acceptFriends của B
      const existUserAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      })

      if (!existUserAinB) {
        await User.updateOne({
          _id: userId,
        }, {
          $push: {
            acceptFriends: myUserId,
          },
        })
      }

      // Thêm id của B vào requestFriends của A
      const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      })
      if (!existUserBinA) {
        await User.updateOne({
          _id: myUserId,
        }, {
          $push: {
            requestFriends: userId,
          },
        })
      }

      // Lấy độ dài acceptFriends của B và trả về cho B
      const infoUserB = await User.findOne({
        _id: userId,
      })

      const lengthAcceptFriends = infoUserB.acceptFriends.length
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends
      })

      // Lấy thông tin của A trả về cho B
      const infoUserA = await User.findOne({
        _id: myUserId,
      }).select("id avatar fullName")

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIENDS", {
        userId: userId,
        infoUserA: infoUserA
      })
    })

    // Hủy yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id

      // Xoá id của A trong acceptFriends của B
      const existUserAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      })

      if (existUserAinB) {
        await User.updateOne({
          _id: userId
        }, {
          $pull: {
            acceptFriends: myUserId,
          },
        })
      }

      // Xoá id của B trong requestFriends của A
      const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      })
      if (existUserBinA) {
        await User.updateOne({
          _id: myUserId,
        }, {
          $pull: {
            requestFriends: userId,
          },
        })
      }
      // Lấy độ dài acceptFriends của B và trả về cho B
      const infoUserB = await User.findOne({
        _id: userId,
      })

      const lengthAcceptFriends = infoUserB.acceptFriends.length
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends
      })

      // Lấy thông tin của A trả về cho B
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userId: userId,
        userIdA: myUserId
      })
    })

    // Từ chối yêu cầu kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id

      // Xoá id của A trong acceptFriends của B
      const existUserAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      })

      if (existUserAinB) {
        await User.updateOne({
          _id: myUserId
        }, {
          $pull: {
            acceptFriends: userId,
          },
        })
      }

      // Xoá id của B trong requestFriends của A
      const existUserBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      })
      if (existUserBinA) {
        await User.updateOne({
          _id: userId,
        }, {
          $pull: {
            requestFriends: myUserId,
          },
        })
      }

    })

    // Chấp yêu cầu kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id

      
      const existUserAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      })

      const existUserBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      })

      let roomChat
      // Tạo room chat giữa A và B
      if (existUserAinB && existUserBinA) {
        roomChat = new RoomChat({
          typeRoom: "friend",
          users: [
            {
              user_id: userId,
              role: "superAdmin"
            },
            {
              user_id: myUserId,
              role: "superAdmin"
            }
          ]
        })

        await roomChat.save()
      }

      // Thêm {user_id, room_chat_id} của A vào friendList của B
      // Xoá id của A trong acceptFriends của B
      if (existUserAinB) {
        await User.updateOne({
          _id: myUserId
        }, {
          $push: {
            friendList: {
              user_id: userId,
              room_chat_id: roomChat._id,
            }
          },
          $pull: {
            acceptFriends: userId,
          },
        })
      }

      // Thêm {user_id, room_chat_id} của B vào friendList của A
      // Xoá id của B trong requestFriends của A
      if (existUserBinA) {
        await User.updateOne({
          _id: userId,
        }, {
          $push: {
            friendList: {
              user_id: myUserId,
              room_chat_id: roomChat._id,
            }
          },
          $pull: {
            requestFriends: myUserId,
          },
        })
      }

    })
  })
}