const mongoose = require("mongoose")
const generate = require("../helpers/generate")

// Define the user schema
const userSchema = new mongoose.Schema({
    avatar: String,
    fullName: String,
    email: String,
    password: String,
    tokenUser: String, // Không sử dụng default ở đây
    phone: String,
    acceptFriends: Array,
    requestFriends: Array,
    statusOnline: String,
    friendList: [{
        user_id: String,
        room_chat_id: String
    }],
    status: {
        type: String,
        enum: ["active", "inactive", "banned"],
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
})

// Middleware để tạo tokenUser trước khi lưu
userSchema.pre("save", function (next) {
    if (!this.tokenUser) {
        this.tokenUser = generate.generateRandomString(20) // Tạo token mới mỗi lần lưu
    }
    next()
})

const User = mongoose.model("User", userSchema, "users")
module.exports = User