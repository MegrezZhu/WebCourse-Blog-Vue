'use strict';

let express = require('express');
let router = express.Router();

router
    .use(function (req, res, next) {
        setTimeout(next, Math.random() * 2000);
        // 增加延迟，用于前端loading特效的debug
    })
    .use('/api/login', require('./login'))
    .use('/api/logout', require('./logout'))
    .use('/api/regist', require('./regist'))
    .use('/api/registCheck', require('./check'))

module.exports = router;