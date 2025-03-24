const express = require("express");
require("dotenv").config();
const route = require("./routes/client/index.route");
const app = express();
const port = process.env.PORT;


app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

//route
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})