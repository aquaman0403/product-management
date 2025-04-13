const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");
const { tree } = require("../../helpers/createTree");

// [GET] /admin/product-categories
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find);
    const newRecords = tree(records)

    res.render("admin/pages/product-categories/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
    });
}

// [GET] /admin/product-categories/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find)
    const newRecords = tree(records)


    res.render("admin/pages/product-categories/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords,
    });
}

// [POST] /admin/product-categories/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions
    if (permissions.includes("products-category_creaete")) {
        if (req.body.position == "") {
            const count = await ProductCategory.countDocuments({});
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
    
        const record = new ProductCategory(req.body);
        await record.save()
    
        res.redirect("/admin/product-categories");
    } else {
        return
    }
}

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id

        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        })

        const records = await ProductCategory.find({
            deleted: false
        })

        const newRecords = tree(records)

        res.render("admin/pages/product-categories/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-categories`)
    }
}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    req.body.position = parseInt(req.body.position)


    await ProductCategory.updateOne({ _id: id }, req.body)

    res.redirect("back")
}