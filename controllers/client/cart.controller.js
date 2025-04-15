const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/products");


// [GET] /cart/
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

    res.render("client/pages/cart/index", {
        pageTile: "Giỏ hàng",
        cartDetail: cart
    })
}


module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)

    const cart = await Cart.findOne({
        _id: cartId,
    })

    const exsitProductInCart = cart.products.find((item) => item.product_id === productId)

    if (exsitProductInCart) {
        const newQuantity = exsitProductInCart.quantity + quantity
        await Cart.updateOne({ _id: cartId, "products.product_id": productId }, {
            $set: {
                "products.$.quantity": newQuantity,
            },
        })
        req.flash("success", "Cập nhật số lượng sản phẩm thành công")
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity,
        }
    
        await Cart.updateOne({ _id: cartId}, {
            $push: {
                products: objectCart,
            },
        })
        
        req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công")
    }
    res.redirect("back")
}

module.exports.delete = async (req, res) => {
    const productId = req.params.productId
    const cartId = req.cookies.cartId

    await Cart.updateOne({
        _id: cartId
    }, {
        "$pull": {
            products: {
                "product_id": productId
            }
        }
    })

    req.flash("success", "Xoá thành công!")

    console.log(productId)

    res.redirect("back")
}

module.exports.update = async (req, res) => {
    const productId = req.params.productId
    const cartId = req.cookies.cartId
    const quantity = req.params.quantity

    await Cart.updateOne({ _id: cartId, "products.product_id": productId }, {
        $set: {
            "products.$.quantity": quantity,
        },
    })
    req.flash("success", "Cập nhật số lượng sản phẩm thành công")

    console.log(productId)

    res.redirect("back")
}