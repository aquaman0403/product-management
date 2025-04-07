const Role = require("../../models/role.model")

// [GET] /admin/dashboard
module.exports.index =  async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    })
} 

module.exports.create = async (req, res) => {

    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    })
}

module.exports.createPost = async (req, res) => {
    const record = new Role(req.body)
    await record.save()

    res.redirect("/admin/roles")
}

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        let find = {
            _id: id,
            deleted: false
        }
    
        const data = await Role.findOne(find)
    
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa",
            data: data
        })
    } catch (error) {
        res.redirect("/admin/roles")
    }
}

module.exports.editPatch = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Cập nhật sản phẩm thành công!");
    } catch (error) {
        console.log(error);
        req.flash("error", "Cập nhật sản phẩm thất bại!");
    }

    res.redirect(`/admin/roles`);
}