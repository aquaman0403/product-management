const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.render("client/pages/products/index");
});

router.get("/create", async (req, res) => {
    res.render("client/pages/products/index");
});

router.get("/edit", async (req, res) => {
    res.render("client/pages/products/index");
});

module.exports = router;