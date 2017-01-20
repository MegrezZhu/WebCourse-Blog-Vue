'use strict';

let express = require('express');
let router = express.Router();

let users = require('../model/users');

/* GET home page. */
router
    .use(function (req, res, next) {
        if (req.session.error === true) {
            res.locals.error = true;
            req.session.error = false;
        }
        next();
    })
    .get('/', function (req, res, next) {
        if (!!res.locals.user) {
            if (!!req.query.username) {
                if (res.locals.user.name !== req.query.username) {
                    req.session.error = true;
                    res.redirect(`/?username=${res.locals.user.name}`);
                } else
                    res.render('detail');
            } else
                res.redirect(`/?username=${res.locals.user.name}`);
        } else {
            if (!!req.query.username)
                res.redirect('/');
            else
                res.render('index');
        }
    });

module.exports = router;
