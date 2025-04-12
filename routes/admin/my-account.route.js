const express = require("express");
const multer = require("multer");
const router = express.Router();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();


const controller = require("../../controllers/admin/my-account.controller.js");

router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch(
    "/edit", 
    upload.single("avatar"),
    uploadCloud.uploadCloud,
    controller.editPatch
);

module.exports = router;