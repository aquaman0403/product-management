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