module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập Họ và tên!");
        res.redirect("back");
        return;
    }

    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email!");
        res.redirect("back");
        return;
    }

    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập Mật khẩu!");
        res.redirect("back");
        return;
    }
    next();
}

module.exports.loginPost = (req, res, next) => {

    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email!");
        res.redirect("back");
        return;
    }

    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập Mật khẩu!");
        res.redirect("back");
        return;
    }
    next();
}


module.exports.forgotPassword = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email!");
        res.redirect("back");
        return;
    }

    next()
}

module.exports.resetPasswordPost = async (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập Mật khẩu!");
        res.redirect("back");
        return;
    }

    if (!req.body.confirmPassword) {
        req.flash("error", "Vui lòng nhập lại Mật khẩu!");
        res.redirect("back");
        return;
    }

    if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Mật khẩu không khớp!");
        res.redirect("back");
        return;
    }

    next()
}