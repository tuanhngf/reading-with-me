const express = require("express")
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const router = require("./routes");

const app = express();
require('dotenv').config()

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
      extended: true,
    })
  );
  
//init db
require('./mongodb')

//init routes
app.use('', router);


module.exports = app; 
