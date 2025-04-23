const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
    try {
        if (req.cookies.tokenUser) {
            console.log("TokenUser:", req.cookies.tokenUser); // Log tokenUser
            const user = await User.findOne({
                tokenUser: req.cookies.tokenUser,
                deleted: false
            }).select("-password -tokenUser -deleted");

            if (user) {
                console.log("User found:", user); // Log user
                res.locals.user = user;
            } else {
                console.log("No user found with the given token.");
            }
        } else {
            console.log("No tokenUser in cookies.");
        }
    } catch (error) {
        console.error("Error in infoUser middleware:", error);
    }
    next();
};