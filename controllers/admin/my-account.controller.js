const Account = require("../../models/account.model")
const systemConfig = require("../../config/system");
const md5 = require("md5");


module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "My Account",
    })
}

module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Edit My Account",
    })
}

module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;

    try {
        const emailExist = await Account.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            req.flash('error', `Email: ${req.body.email} đã tồn tại!`);
            return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/my-account`);
        }

        const updateData = { ...req.body };

        if (updateData.password) {
            updateData.password = md5(updateData.password);
        } else {
            delete updateData.password;
        }

        await Account.updateOne({ _id: id }, updateData);

        req.flash('success', 'Cập nhật tài khoản thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/my-account`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Lỗi khi cập nhật tài khoản');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/my-account/edit`);
    }
}