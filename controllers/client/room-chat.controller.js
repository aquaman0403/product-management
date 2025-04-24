const RoomChat = require("../../models/room-chat.model")
const User = require("../../models/user.model")

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id
  const listRoomsChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false
  })

  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng",
    listRoomsChat: listRoomsChat,
  })
}

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id
    }).select("fullName avatar")

    friend.infoFriend = infoFriend
  }

  console.log(friendList)

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng",
    friendList: friendList,
  })
}

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title
  const usersId = req.body.usersId
  
  const dataChat = {
    title: title,
    typeRoom: "group",
    users: []
  }

  usersId.forEach((userId) => {
    dataChat.users.push({
      user_id: userId,
      role: "user"
    })
  })

  dataChat.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin"
  })

  const room = new RoomChat(dataChat)
  await room.save()

  res.redirect(`/chat/${room.id}`)
}