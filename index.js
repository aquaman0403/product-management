const express = require("express");
const methodOverride = require("method-override");
require("dotenv").config();
const mongoose = require("mongoose");
const database = require("./config/database");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const app = express();
const port = process.env.PORT;
app.use(methodOverride("_method"));

const systemConfig = require("./config/system");

database.connect();

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

//route
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})