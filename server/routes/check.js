'use strict';

let express = require('express');
let checker = require('../model/check');

let router = express.Router();

router
    .post('/', function (req, res) {
        let {name, value} = req.body;
        // console.log(argName, arg);
        if (!checker.formatCheck(name, value)) res.json({res: 'error'});
        else {
            // console.log('checking');
            // console.log(req.app.locals.db);
            checker
                .existCheck(name, value, req.app.locals.db)
                .then(result => res.json({res: result ? 'existed' : 'ok'}));
        }
    });

module.exports = router;