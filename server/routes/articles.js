'use strict';

let express = require('express');
let checker = require('../model/check');

let router = express.Router();

router
    .post('/new', function (req, res, next) {
        let data = req.body;
        // console.log(data);
        if (res.locals.user && data.title && data.date && data.content) {
            let arti = req.app.locals.db.articles;
            arti.newArticle(Object.assign({}, data, {
                author: {
                    id: res.locals.user.id,
                    name: res.locals.user.name
                }
            }))
                .then(artiId => res.json(artiId))
                .catch(err => next(err));
        } else next(new Error('invalid article data'));
    })
    .post('/get', async function (req, res, next) {
        let info = req.body,
            arti = req.app.locals.db.articles;
        try {
            let arr = await arti.getArticles(info.param, info.keys, info.to ? info.to - Number(info.from) + 1 : undefined, info.from - 1);
            res.json(arr);
        } catch (err) {
            next(err);
        }
    })
    .post('/getone', async function (req, res, next) {
        let {id, keys} = req.body,
            arti = req.app.locals.db.articles;
        try {
            let _keys = {};
            res.json(await arti.getArticle(id, keys));
        } catch (err) {
            next(err);
        }
    });

module.exports = router;