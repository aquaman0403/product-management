const User = require("../../models/user.model")

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id

      // Thêm id của A vào acceptFriend của B
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

      // Thêm id của B vào requestFriend của A
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
  })
}