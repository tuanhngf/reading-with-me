const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect(process.env.URI)
            .then((_) => console.log(`Connected Mongodb Success`))
            .catch((err) => console.log(`Error Connect`, err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;

// const connect = mongoose
//     .connect(process.env.URI)
//     .then((_) => console.log(`Connected Mongodb Success`))
//     .catch((err) => console.log(`Error Connect: `, process.env.URI));

// console.log(configs);

// module.exports = connect;
