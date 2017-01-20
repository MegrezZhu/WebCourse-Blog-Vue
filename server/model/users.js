'use strict';

let mongodb = require('mongodb');
let secure = require('./secure');
let client = mongodb.MongoClient;
let serverUrl = require('./mongoInfo').url;

class User {
    constructor(name, password, id, phone, mail) {
        this.name = name;
        this.id = id;
        this.phone = phone;
        this.mail = mail;
        this.password = secure.encryptMD5(password).result;
    }
}

class UserList {
    constructor(db) {
        this.db = db;
        this.col = db.collection('users');
    }

    checkExist(user) {
        let param = {
            $or: [{name: user.name}, {id: user.id}, {phone: user.phone}, {mail: user.mail}]
        };
        return this.col
                   .find(param)
                   .count()
                   .then(count => count > 0);
    }

    regist({name, password, id, phone, mail}) {
        let that = this;
        let user = new User(name, password, id, phone, mail);
        return that.checkExist(user)
                   .then(function (result) {
                       if (result)
                           return Promise.reject(new Error('user exist!'));
                       else
                           return that.col
                                      .insertOne(user)
                   });
    }

    login(name, password) {
        let _password = secure.encryptMD5(password).result;
        return this.getUser({name: name, password: _password});
    }

    getUser(param) {
        return this.col
                   .find(param)
                   .limit(1)
                   .toArray()
                   .then(arr => arr.length ? arr[0] : null);
    }
}

module.exports = UserList;
