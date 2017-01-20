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
            if (req.body.name && req.body.password) {
                users.login(req.body.name, req.body.password)
                     .then(function (user) {
                         if (!!user) {
                             req.session.name = user.name;
                             res.json(user);
                         } else {
                             res.json(null);
                         }
                     });
            } else {
                res.json(null);
            }
        }
    });

module.exports = router;