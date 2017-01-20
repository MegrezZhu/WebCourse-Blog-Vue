'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let bodyParser = require('body-parser');

let database = require('./model/database');

// let registRouter = require('./routes/regist');
let routers = require('./routes/routers');

module.exports = function (db) {

    let app = express();

    // view engine & template path
    app.set('views', path.join(__dirname, '../', 'app/'));
    app.set('view engine', 'jade');

    database.setDB(db);
    // for future usage
    app.locals.db = database;

    // app.use(favicon(path.join(__dirname, '../app/images/favicon.jpg')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.static(path.join(__dirname, '../app/public')));

    app.use(session({
        secret: 'WebCoure Blog',
        cookie: {maxAge: 86400000},
        name: 'sid',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({db})
    }));

    // auto login -> check sessions
    app.use(require('./middlewares/autoLogin'));

    // set routers
    app.use(routers);

    app.get('/', (req, res) => {
        res.sendfile(path.join(__dirname, '../app/index.html'));
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        console.log(err);
        res.status(err.status || 500);
        // res.render('error');
        res.end();
    });

    return app;
};
