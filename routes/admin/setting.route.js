const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/setting.controller.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

router.get("/general", controller.general);
router.patch(
    "/general",
    upload.single("logo"),
    uploadCloud.uploadCloud,
    controller.generalPost
);

module.exports = router;