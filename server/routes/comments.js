'use strict';

let express = require('express');
let router = express.Router();

const authorize = async function (user, commId, db, adminPass) {
    if (!user) return false;
    if (user.isAdmin && adminPass) return true;
    let {author} = await db.getComment(commId, ['author']);
    return user.id === author.id;
}

router
    .post('/new', async function (req, res, next) {
        if (!res.locals.user) {
            res.json(null);
        } else {
            try {
                let {name, id} = res.locals.user;
                let {articleId, content, date} = req.body;
                if (name && id && articleId && content && date) {
                    let db = req.app.locals.db.articles;
                    let commId = await db.newComment(articleId, {content, author: {name, id}, date});
                    res.json(commId);
                } else res.json(null);
            } catch (err) {
                next(err);
            }
        }
    })
    .post('/get', async function (req, res, next) {
        try {
            let {id, keys} = req.body,
                db = req.app.locals.db.articles,
                user = res.locals.user;
            let data = await db.getComment(id, keys);
            if (data) {
                console.log(user);
                if (data.hide && (user && !user.isAdmin || !user)) data.content = undefined;
                res.json(data);
            } else {
                res.json(null);
            }
        } catch (err) {
            next(err);
        }
    })
    .post('/delete', async function (req, res, next) {
        try {
            let {id, articleId} = req.body,
                user = res.locals.user,
                db = req.app.locals.db.articles;
            if (!await authorize(user, id, db)) {
                res.json(false);
            } else {
                let result = await db.removeComment(id, articleId);
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
                let result = await db.editComment(id, {content});
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
            if (!await authorize(user, id, db)) {
                res.json(false);
            } else {
                let result = await db.editComment(id, {hide});
                res.json(true);
            }
        } catch (err) {
            next(err);
        }
    })

module.exports = router;