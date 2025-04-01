const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({position: "desc"});

    const newProducts = products.map( item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
        return item;
    });

    res.render("client/pages/products/index",{
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    
    const product = await Product.findOne({
        slug: slug,
        status: "active",
        deleted: false,
    });

    res.render("client/pages/products/detail", {
        pageTitle: product.title,
        product: product,
    });
}