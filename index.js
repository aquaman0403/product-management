const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("express-flash");
const cookieParser = require('cookie-parser')
const session = require("express-session");
require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const database = require("./config/database");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

const systemConfig = require("./config/system");

database.connect();

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

// Flash
app.use(cookieParser("Dupham2003bgHehehehehe"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// public
app.use(express.static(`${__dirname}/public`));

//route
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})