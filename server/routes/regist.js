'use strict';

let express = require("express");
let router = express.Router();

let checker = require('../model/check');

router
    .post('/', function (req, res, next) {
        let database = req.app.locals.db;
        checker.allCheck(req.body, req.app.locals.db)
               .then(function (result) {
                   if (result) {
                       return database.users.regist(req.body);
                   } else
                       return Promise.reject(new Error('invalid data!'));
               })
               .then(function (user) {
                   if (user) {
                       req.session.uid = user.id;
                   }
                   res.json(user);
               })
               .catch(err => next(err));
    });

module.exports = router;