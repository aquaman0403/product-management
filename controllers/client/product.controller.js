const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
const ProductCategory = require("../../models/product-category.model");
const { getSubCategory } = require("../../helpers/product-category");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({position: "desc"});

    const newProducts = productHelper.priceNewProducts(products);

    res.render("client/pages/products/index",{
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts,
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slugProduct;
    
    const product = await Product.findOne({
        slug: slug,
        status: "active",
        deleted: false,
    });

    if (product.product_category_id) {
        const category = await ProductCategory.findOne({
            _id: product.product_category_id,
            status: "active",
            deleted: false,
        });

        product.category = category;
    }

    product.priceNew = productHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
        pageTitle: "Chi tiết sản phẩm",
        product: product,
    });
}

// [GET] /products/category/:slugCategory
module.exports.category = async (req, res) => {

    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        deleted: false,
    });

    const listSubCategory = await getSubCategory(category.id);

    const products = await Product.find({
        product_category_id: {
            $in: [category.id, ...listSubCategory.map((item) => item.id)]
        },
        deleted: false,
    }).sort({position: "desc"});

    const newProducts = productHelper.priceNewProducts(products);
    res.render("client/pages/products/index",{
        pageTitle: category.title,
        products: newProducts,
    });
}