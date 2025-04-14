const Cart = require("../../models/cart.model")

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