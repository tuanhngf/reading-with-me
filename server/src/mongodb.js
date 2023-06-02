const mongoose = require("mongoose");
const configs = require("./configs");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(configs.db.uri)
      .then((_) => console.log(`Connected Mongodb Success`))
      .catch((err) => console.log(`Error Connect`));
  }

  static getInstance(){
    if(!Database.instance){
        Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb