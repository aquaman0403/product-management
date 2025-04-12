const ProductCategory = require("../../models/product-category.model");
const { tree } = require("../../helpers/createTree");


module.exports.category = async (req, res, next) => {
    const productCategory = await ProductCategory.find({
            deleted: false,
    })
    
    const newproductCategory = tree(productCategory)
    res.locals.layoutProductCategory = newproductCategory;
    next() 
}