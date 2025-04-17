const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: { total: 0, active: 0, inactive: 0 },
        product: { total: 0, active: 0, inactive: 0 },
        account: { total: 0, active: 0, inactive: 0 },
        user: { total: 0, active: 0, inactive: 0 }
    };
    
    const models = {
        categoryProduct: ProductCategory,
        product: Product,
        account: Account,
        user: User
    };
    
    for (const [key, Model] of Object.entries(models)) {
        statistic[key].total = await Model.countDocuments({ deleted: false });
        statistic[key].active = await Model.countDocuments({ deleted: false, status: "active" });
        statistic[key].inactive = await Model.countDocuments({ deleted: false, status: "inactive" });
    }
    
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Dashboard",
        statistic: statistic,
    })
} 