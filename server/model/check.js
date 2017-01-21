'use strict';

let database = require('../model/database');

let checkReg = {
    name: /^\w{6,18}$/,
    id: /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/,
    phone: /^[1-9]\d{10}$/,
    mail: /^[a-zA-Z0-9_\\-]+@(([a-zA-Z0-9_\-])+\.)+[a-zA-Z]{2,4}$/,
    password: /^[0-9A-Za-z-_]{6,12}$/
};

const formatCheck = function (argName, arg) {
    return !!arg.match(checkReg[argName]);
};

const existCheck = function (argName, arg, database) {
    return database.users
                   .checkExist({[argName]: arg});
};

const checkItems = ['name', 'id', 'mail', 'phone'];

const allCheck = function (user, database) {
    if (checkItems.every(argName => !!user[argName] && !!user[argName].match(checkReg[argName]))) {
        return database.users
                       .checkExist(user)
                       .then(result => !result);
    } else {
        return Promise.resolve(new Error('invalid!'));
    }
};

module.exports = {
    formatCheck,
    existCheck,
    allCheck
};