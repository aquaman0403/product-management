const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");

// [GET] /admin/product-categories
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find);

    res.render("admin/pages/product-categories/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records,
    });
}

// [GET] /admin/product-categories/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product-categories/create", {
        pageTitle: "Tạo danh mục sản phẩm",
    });
}

// [POST] /admin/product-categories/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments({});
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save()

    res.send("Tạo danh mục sản phẩm thành công!");
}