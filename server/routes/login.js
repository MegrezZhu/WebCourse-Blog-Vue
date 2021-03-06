'use strict';

let express = require('express');
let router = express.Router();

router
    .post('/', function (req, res) {
        let users = req.app.locals.db.users;
        if (!!res.locals.user) {
            // has auto logged in
            res.json(res.locals.user);
        } else {
            if (req.body.id && req.body.pw) {
                users.login(req.body.id, req.body.pw)
                     .then(function (user) {
                         if (!!user) {
                             user.pw = undefined;
                             req.session.uid = user.id;
                             res.json(user);
                         } else {
                             res.json(null);
                         }
                     })
                    .catch(err => next(err));
            } else {
                res.json(null);
            }
        }
    });

module.exports = router;