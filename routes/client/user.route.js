const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller.js");
const validate = require("../../validates/client/user.validate.js");

router.get("/register", controller.register)
router.post("/register", validate.registerPost, controller.registerPost)

module.exports = router;