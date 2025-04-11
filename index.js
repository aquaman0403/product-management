const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("express-flash");
const moment = require("moment");
const cookieParser = require('cookie-parser')
const session = require("express-session");
require("dotenv").config();
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

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please use a different port.`);
        process.exit(1);
    } else {
        throw err;
    }
});