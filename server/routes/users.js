'use strict';

let express = require('express');
let router = express.Router();

/* GET users listing. */
router
    .post('/info', function (req, res, next) {
        let {id, argNames} = req.body,
            db = req.app.locals.db.users;
        db.getUserInfo(id, argNames)
          .then(info => res.json(info))
          .catch((err) => next(err));
    });

module.exports = router;
