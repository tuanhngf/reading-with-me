const dbInit = {
  dev: {
    port: 8816,
    uri: "mongodb://localhost:27017/rwmDEV",
  },
  pro: {
    port: process.env.PORT,
    uri: process.env.URI,
  },
};
const env = process.env.NODE_ENV || "dev";
const db = dbInit[env];


const configs = { db };
module.exports = configs;
