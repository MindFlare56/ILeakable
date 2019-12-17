
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const session = require('express-session');
const crypto = require('crypto');
const csrf = require('csurf');

/********************************************/

app.set('trust proxy', 1);
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(helmet());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function (req, res, next){
    res.locals._csrf = csrf({ cookie: true });
    next();
});
app.use(mongoSanitize());
app.use(mongoSanitize({replaceWith: '_'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

/********************************************/

const generate_id = function() {
    return crypto.randomBytes(16).toString('base64');
};

app.use(session({
    genid: generate_id,
    secret: 'bob_lewis_123;',
    name: 'user_sid',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

//must remain under session >.<
app.use('/', require('./routes/Routers'));

//todo refactor errors somewhere else
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  const router = express.Router();
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  const json = {'status': 'success'};
  console.log(router);
  res.render('error.pug', json);
});

module.exports = app;
