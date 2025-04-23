const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const Cart = require("../../models/cart.model")
const md5 = require("md5")
const { generateRandomNumber } = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendmail")

module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTile: "Đăng ký tài khoản",
    })
}

module.exports.registerPost = async (req, res) => {
    
    const existEmail = await User.findOne({ email: req.body.email, deleted: false })
    if (existEmail) {
        req.flash("error", "Email đã tồn tại!")
        res.redirect("back")
        return
    }

    req.body.password = md5(req.body.password)

    const user = new User(req.body)
    await user.save()

    res.cookie("tokenUser", user.tokenUser)
    req.flash("success", "Đăng ký tài khoản thành công!")

    res.redirect("/")
}

module.exports.login = async (req, res) => {


    res.render("client/pages/user/login", {
        pageTile: "Đăng nhập tài khoản",
    })
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = md5(req.body.password)

    const user = await User.findOne({ email: email, deleted: false })

    if (!user) {
        req.flash("error", "Email không tồn tại!")
        res.redirect("back")
        return
    }

    if (user.password != password) {
        req.flash("error", "Mật khẩu không đúng!")
        res.redirect("back")
        return
    }

    if (user.status == 'inactive') {
        req.flash("error", "Tài khoản của bạn đã bị khóa!")
        res.redirect("back")
        return
    }

    res.cookie("tokenUser", user.tokenUser)
    await User.updateOne({
        tokenUser: user.tokenUser,
    }, {
        statusOnline: "online",
    })

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id)
    })

    await Cart.updateOne({
        _id: req.cookies.cartId,
    }, {
        user_id: user.id,
    })

    req.flash("success", "Đăng nhập tài khoản thành công!")
    res.redirect("/")
}

module.exports.logout = async (req, res) => {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser,
    }, {
        statusOnline: "offline",
    })

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", res.locals.user.id)
    })

    res.clearCookie("tokenUser")
    req.flash("success", "Đăng xuất tài khoản thành công!")
    res.redirect("/")
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTile: "Quên mật khẩu",
    })
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({
        email: email,
        deleted: false,
    })

    if (!user) {
        req.flash("error", "Email không tồn tại!")
        res.redirect("back")
        return
    }

    const objectForgotPassword = {
        email: email,
        otp: generateRandomNumber(6),
        expiredAt: Date.now(),
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    // Send email to user with OTP

    const subject = "Mã OTP đặt lại mật khẩu"
    const html = `Mã OTP của bạn là: <b>${objectForgotPassword.otp}</b>. Thời hạn sử dụng là 3 phút. Vui lòng không chia sẻ mã OTP này với bất kỳ ai khác.`


    sendMailHelper.sendMail(email, subject, html)

    res.redirect(`/user/password/otp?email=${email}`)
}

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email

    res.render("client/pages/user/otp-password", {
        pageTile: "Nhập mã OTP",
        email: email,
    })
}

module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    })

    const user = await User.findOne({
        email: email,
        deleted: false,
    })
    

    if (!forgotPassword) {
        req.flash("error", "Mã OTP không đúng hoặc đã hết hạn!")
        res.redirect("back")
        return
    }
    
    res.cookie("tokenUser", user.tokenUser)

    res.redirect(`/user/password/reset`)
}

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTile: "Đặt lại mật khẩu",
    })
}

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser

   await User.updateOne({
        tokenUser: tokenUser,
    }, {
        password: md5(password),
   })

   res.redirect("/")
}

module.exports.info = async (req, res) => {
   res.render("client/pages/user/info", {
        pageTile: "Thông tin tài khoản",
    })
}