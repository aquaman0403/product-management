const User = require("../../models/user.model")
const md5 = require("md5")

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
    req.flash("success", "Đăng nhập tài khoản thành công!")
    res.redirect("/")
}

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    req.flash("success", "Đăng xuất tài khoản thành công!")
    res.redirect("/")
}