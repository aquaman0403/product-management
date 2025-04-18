const mongoose = require("mongoose")
const generate = require("../helpers/generate")

// Define the user schema
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
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

const User = mongoose.model("User", userSchema, "users")
module.exports = User