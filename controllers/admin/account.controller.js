const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system");
const md5 = require("md5");


// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Account.find(find).populate("role_id");

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })

        record.role = role
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Accounts",
        accounts: records
    })
}

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo tài khoản",
        roles: roles
    })
}

module.exports.createPost = async (req, res) => {
    const emailExsit = await Account.findOne({
        email: req.body.email,
        deleted: false
    })

    if (emailExsit) {
        req.flash("error", `Email: ${req.body.email} đã tồn tại!`)
        res.redirect("back")
    } else {
        req.body.password = md5(req.body.password)
        const record = new Account(req.body)
        await record.save()

        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    }

    try {
        const data = await Account.findOne(find)

        const roles = await Role.find({
            deleted: false
        })

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    try {
        const emailExist = await Account.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            req.flash('error', `Email: ${req.body.email} đã tồn tại!`);
            return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/accounts`);
        }

        const updateData = { ...req.body };

        if (updateData.password) {
            updateData.password = md5(updateData.password);
        } else {
            delete updateData.password;
        }

        await Account.updateOne({ _id: id }, updateData);

        req.flash('success', 'Cập nhật tài khoản thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Lỗi khi cập nhật tài khoản');
        res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/accounts/edit/${id}`);
    }
};