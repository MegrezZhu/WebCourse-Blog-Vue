'use strict';

let database = require('../model/database');

let checkReg = {
    name: /^[a-zA-Z0-9_\u4E00-\u9FA5]{1,18}$/,
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

const checkItems = [
    {name: 'name', require: true},
    {name: 'id', require: true},
    {name: 'mail', require: true},
    {name: 'phone', require: false}
];

const allCheck = function (user, database) {
    if (checkItems.every(({name, require}) => {
            if (!user[name] && !require) return true;
            return !!user[name] && !!user[name].match(checkReg[name]);
        })) {
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