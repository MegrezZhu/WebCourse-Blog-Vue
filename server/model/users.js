'use strict';

let mongodb = require('mongodb');
let secure = require('./secure');
let client = mongodb.MongoClient;
let serverUrl = require('./mongoInfo').url;
let lodash = require('lodash');

class User {
    constructor(name, password, id, phone, mail, isAdmin) {
        this.name = name;
        this.id = id;
        this.phone = phone;
        this.mail = mail;
        this.pw = secure.encryptMD5(password).result;
        this.isAdmin = isAdmin;
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

    regist({name, pw, id, phone, mail}) {
        // TO-DO ： 似乎check被调用了两次，以后检查一下
        let that = this;
        let user = new User(name, pw, id, phone, mail, false);
        return that.checkExist(user)
                   .then(function (result) {
                       if (result)
                           return Promise.reject(new Error('user exist!'));
                       else
                           return that.col
                                      .insertOne(user)
                   })
                   .then(() => user) // 注册成功后返回user实例
                   .catch(err => null);// 失败返回null
    }

    login(id, password) {
        let _password = secure.encryptMD5(password).result;
        console.log(`pre:${password}, after:${_password}`);
        return this.getUser({id, pw: _password});
        // 登录成功也返回user实例
    }

    getUser(param) {
        return this.col
                   .find(param)
                   .limit(1)
                   .toArray()
                   .then(arr => arr.length ? arr[0] : null);
    }

    getUserInfo(id, argNames) {
        return this.col
                   .find({id})
                   .limit(1)
                   .toArray()
                   .then(arr => arr[0] ? lodash.pick(arr[0], argNames) : null);
    }

    count() {
        return this.col
                   .find()
                   .count();
    }
}

module.exports = UserList;
