const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order = require("../../models/order.model")
const productHelper = require("../../helpers/products");

module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId

    const cart = await Cart.findOne({ _id: cartId })

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id

            const productInfo = await Product.findOne({ _id: productId })

            productInfo.priceNew = productHelper.priceNewProduct(productInfo)

            item.totalPrice = item.quantity * productInfo.priceNew

            item.productInfo = productInfo
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart,
    })
}

module.exports.order = async (req, res) => {
    const cardId = req.cookies.cartId
    const userInfo = req.body

    const cart = await Cart.findOne({ _id: cardId })

    let products = []

    for (const product of cart.products) {
        const objectProduct = {
            products_id: product.product_id,
            quantity: product.quantity,
            discountPercentage: 0,
            price: 0,
        }

        const productInfo = await Product.findOne({ _id: product.product_id })
        objectProduct.discountPercentage = productInfo.discountPercentage
        objectProduct.price = productInfo.price
        products.push(objectProduct)
    }

    const objectOrder = {
        cart_id: cardId,
        userInfo: userInfo,
        products: products,
    }

    const order = new Order(objectOrder)
    await order.save()

    await Cart.updateOne({ _id: cardId }, { $set: { products: [] } })

    res.send("ok")
}