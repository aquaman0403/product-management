const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system");
const md5 = require("md5");

module.exports.login = (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
        return
    }

    res.render("admin/pages/auth/login", {
        pageTitle: "Đăng nhập",
    })
}

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body

    const user = await Account.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash("error", "Email không tồn tại!")
        res.redirect("back")
        return
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Sai mật khẩu")
        res.redirect("back")
        return
    }

    if (user.status === 'inactive') {
        req.flash("error", "Tài khoản đã bị khoá")
        res.redirect("back")
        return
    }

    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}

module.exports.logout = (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}
