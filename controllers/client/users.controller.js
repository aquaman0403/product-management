const User = require("../../models/user.model");
const usersSocket = require("../../socket/client/users.socket")

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  
  usersSocket(res)
  const userId = res.locals.user.id

  const myUser = await User.findOne({
    _id: userId,
    deleted: false,
  })

  const requestFriends = myUser.requestFriends
  const acceptFriends = myUser.acceptFriends

  const users = await User.find({
    $and: [
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $ne: userId } },
    ],
    status: "active",
    deleted: false,
  }).select("avatar fullName").limit(10);

  res.render("client/pages/users/not-friend", {
    pageTile: "Danh sách người dùng",
    users: users,
  })
}

// [GET] /users/request
module.exports.request = async (req, res) => {
  usersSocket(res)
  const userId = res.locals.user.id

  const myUser = await User.findOne({
    _id: userId,
    deleted: false,
  })

  const requestFriends = myUser.requestFriends

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("_id avatar fullName")

  res.render("client/pages/users/request", {
    pageTile: "Lời mời đã gửi",
    users: users,
  })
}

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  usersSocket(res)
  const userId = res.locals.user.id

  const myUser = await User.findOne({
    _id: userId,
    deleted: false,
  })

  const acceptFriends = myUser.acceptFriends
  
  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("_id avatar fullName")

  res.render("client/pages/users/accept", {
    pageTile: "Lời mời đã nhận",
    users: users,
  })
}