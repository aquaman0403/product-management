const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    }).limit(6)

    const newProducts = productHelper.priceNewProducts(productsFeatured);

    const productsNew = await Product.find({
        deleted: false,
        status: "active",
    }).sort({ createdAt: -1 }).limit(6)

    const newProductsNew = productHelper.priceNewProducts(productsNew);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts,
        productsNew: newProductsNew,
    });
}