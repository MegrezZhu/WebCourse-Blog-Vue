'use strict';

let info = require('./mongoInfo'),
    client = require('mongodb').MongoClient,
    Users = require('./users'),
    Articles = require('./articles');

class Database {
    constructor() {
    }

    connect() {
        return client.connect(info.url)
                     .then(db => {
                         this.db = db;
                         this.users = new Users(db);
                         // this.articles = new Articles(db);
                         // this.comments = new Comments(db);
                     });
    }

    setDB(db) {
        this.db = db;
        this.users = new Users(db);
        this.articles = new Articles(db);
        return this;
    }

}

module.exports = new Database();

