'use strict';

const autoLogin = function (req, res, next) {
    let users = req.app.locals.db.users;
    if (!!req.session.name) {
        users.getUser({name: req.session.name})
             .then(user => {
                 res.locals.user = user;
                 next();
             });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = autoLogin;