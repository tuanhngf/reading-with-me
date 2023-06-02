const express = require("express")
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const configs = require("./configs");
const router = require("./routes");

const app = express();
require('dotenv').config()

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db
require('./mongodb')

console.log("PORT: ", configs.db.port);
console.log("URI: ", configs.db.uri);
//init routes
app.use('', router);


module.exports = app;
