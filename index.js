const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const database = require("./config/database");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const app = express();
const port = process.env.PORT;

database.connect();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

//route
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})