const ProductCategory = require("../models/product-category.model");

const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
        parent_id: parentId,
        deleted: false,
        status: "active",
    })

    let allSub = [...subs];
    for(const sub of subs) {
        const subSubs = await getSubCategory(sub.id);
        allSub = allSub.concat(subSubs);
    }

    return allSub;
}

module.exports = {
    getSubCategory,
}