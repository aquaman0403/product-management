const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("express-flash");
const moment = require("moment");
const cookieParser = require('cookie-parser')
const session = require("express-session");

const { Server } = require("socket.io");
const http = require("http");

require("dotenv").config();
const database = require("./config/database");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const app = express();
const port = process.env.PORT;

const server = http.createServer(app);
// Socket io
const io = new Server(server)
global._io = io

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

const systemConfig = require("./config/system");

database.connect();

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

// Flash
app.use(cookieParser("Dupham2003bgHehehehehe"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// public
app.use(express.static(`${__dirname}/public`));

//route
route(app);
routeAdmin(app);

app.get("*", (req, res) => {
    res.render("client/pages/error/404", {
        pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})