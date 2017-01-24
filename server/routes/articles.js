'use strict';

let express = require('express');
let checker = require('../model/check');

let router = express.Router();

const authorize = async function (user, commId, db, adminPass) {
    if (!user) return false;
    if (user.isAdmin && adminPass) return true;
    let {author} = await db.getArticle(commId, ['author']);
    return user.id === author.id;
}

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
            if (keys.indexOf('hide') === -1) keys.push('hide');
            let data = await arti.getArticle(id, keys);
            let user = res.locals.user;
            if (data.hide && (!user || user && !user.isAdmin))
                data.title = data.content = undefined;
            res.json(data);
        } catch (err) {
            next(err);
        }
    })
    .post('/delete', async function (req, res, next) {
        try {
            let {id} = req.body,
                user = res.locals.user,
                db = req.app.locals.db.articles;
            if (!await authorize(user, id, db)) {
                res.json(false);
            } else {
                let result = await db.removeArticle(id);
                res.json(true);
            }
        } catch (err) {
            next(err);
        }
    })
    .post('/edit', async function (req, res, next) {
        try {
            let {id, content} = req.body,
                user = res.locals.user,
                db = req.app.locals.db.articles;
            if (!await authorize(user, id, db)) {
                res.json(false);
            } else {
                let result = await db.editArticle(id, {content});
                res.json(true);
            }
        } catch (err) {
            next(err);
        }
    })
    .post('/hide', async function (req, res, next) {
        try {
            let {id, hide} = req.body,
                user = res.locals.user,
                db = req.app.locals.db.articles;
            if (!await authorize(user, id, db, true)) {
                res.json(false);
            } else {
                let result = await db.editArticle(id, {hide});
                res.json(true);
            }
        } catch (err) {
            next(err);
        }
    })

module.exports = router;