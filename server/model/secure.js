'use strict';

let crypto = require('crypto');

const encrypt = function (data, key) {
    // console.log(`key: ${key}`);
    let _key = !key ? crypto.randomBytes(10).toString('hex') : key;
    let gen = crypto.createHmac('sha1', _key);
    gen.update(data);
    let res = gen.digest().toString('base64');
    // console.log(`result: ${res}`);
    return {data: res, key: _key};
};

const encryptMD5 = function (data, times = 1) {
    while (times--) {
        let gen = crypto.createHash('md5');
        gen.update(data);
        let result = gen.digest('hex');
        data = result;
    }
    return {result: data};
};

const check = function () {

};

module.exports = {
    encrypt,
    encryptMD5,
    check
};
