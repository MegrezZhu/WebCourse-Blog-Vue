'use strict';

const autoLogin = function (req, res, next) {
    let users = req.app.locals.db.users;
    if (!!req.session.uid) {
        users.getUser({id: req.session.uid})
             .then(user => {
                 if (user) {
                     user.pw = undefined;
                     res.locals.user = user;
                     next();
                 } else {
                     req.session.destroy();
                 }
             })
             .catch(err => next(err));
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = autoLogin;