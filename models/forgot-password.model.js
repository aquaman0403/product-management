const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiredAt: {
        type: Date,
        expires: 180
    },
}, {
    timestamps: true
})

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-passwords")
module.exports = ForgotPassword