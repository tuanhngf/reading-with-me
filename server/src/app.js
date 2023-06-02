const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const configs = require("./configs");

const app = express();
require('dotenv').config()

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression())

//init db
require('./mongodb')

console.log("PORT: ", configs.db.port);
console.log("URI: ", configs.db.uri);
//init routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "welcome to Reading With Me - API"
    })
})


module.exports = app;
