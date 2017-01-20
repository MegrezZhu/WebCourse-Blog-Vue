'use strict';

let express = require('express');
let router = express.Router();

router
    .post('/', function (req, res) {
        req.session.destroy();
    });

module.exports = router;