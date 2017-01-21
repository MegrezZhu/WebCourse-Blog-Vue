'use strict';

let express = require('express');
let router = express.Router();

router
    .get('/usercount', function (req, res, next) {
        let db = req.app.locals.db;
        db.users
          .count()
          .then(num => res.json(num))
          .catch(err => next(err));
    })
    .get('/articlecount', function (req, res, next) {
        let db = req.app.locals.db;
        db.articles
          .count()
          .then(num => res.json(num))
          .catch(err => next(err));
    })

module.exports = router;