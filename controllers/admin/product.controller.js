const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const { tree } = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    )
    // End Pagination

    // Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue === "asc" ? 1 : -1;
    } else {
        sort.position = -1; // Mặc định sắp xếp giảm dần
    }
    // End Sort

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne(
        { _id: id },
        { status: status }
    );

    req.flash("success", "Cập nhật trạng thái thành công!");

    res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
            );
            req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm!`);
            break;

        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date });
            req.flash("success", `Đã xoá ${ids.length} sản phẩm!`);
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne(
                    { _id: id },
                    { position: position }
                )
            }
            req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm!`);
            break;

        default:
            break;
    }

    res.redirect("back");
}

// [DELETE] /adimin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date });
    req.flash("success", `Đã xoá sản phẩm!`);
    res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const categories = await ProductCategory.find(find)

    const newCategories = tree(categories)

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm sản phẩm mới",
        categories: newCategories
    })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`/admin/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);

        const categories = await ProductCategory.find({
            deleted: false
        })
        
        const newCategories = tree(categories)

        res.render("admin/pages/products/edit", {
            pageTitle: "Sửa sản phẩm",
            product: product,
            categories: newCategories
        })
    } catch (error) {
        res.redirect("/admin/products")
    }
}

// [PATCH] /admin/products/edit/:id?_method=PATCH
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    try {
        await Product.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Cập nhật sản phẩm thành công!");
    } catch (error) {
        console.log(error);
        req.flash("error", "Cập nhật sản phẩm thất bại!");
    }

    res.redirect(`/admin/products`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);

        console.log(product);

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });

    } catch (error) {

    }
}