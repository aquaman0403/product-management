const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    cart_id: String,
    userInfo: {
        fullName: String,
        phone: String,
        address: String,
    },
    products: [{
        products_id: String,
        quantity: Number,
        discountPercentage: Number,
        price: Number,
    }]
}, {
    timestamps: true,
})

const Order = mongoose.model("Order", orderSchema, "orders")

module.exports = Order