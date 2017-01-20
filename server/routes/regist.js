'use strict';

let express = require("express");
let router = express.Router();

let checker = require('../model/check');
let database = require('../model/database');

router
    .post('/', function (req, res, next) {
        checker.allCheck(req.body, req.app.locals.db)
               .then(function (result) {
                   if (result) {
                       return database.users.regist(req.body);
                   } else
                       return Promise.reject(new Error('invalid data!'));
               })
               .then(function () {
                   req.session.name = req.body.name;
                   res.send('ok');
               })
               .catch(err => next(err));
    });

module.exports = router;