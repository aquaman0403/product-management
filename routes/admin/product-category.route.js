const express = require('express');
const multer = require('multer');
const router = express.Router();

const controller = require('../../controllers/admin/product-category.controller');
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const validate = require("../../validates/admin/product-category.validate");

router.get('/', controller.index);
router.get('/create', controller.create);
router.post("/create", 
    upload.single("thumbnail"), 
    uploadCloud.uploadCloud, 
    validate.createPost, 
    controller.createPost
);

module.exports = router;