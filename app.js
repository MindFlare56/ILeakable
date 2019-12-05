const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);
app.use(helmet());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

app.use('/', require('./routes/Routers'));

app.use( session({
      secret : 'ajC8h;',
      name : 'leak',
    })
);

app.use(session({
      name: 'session',
      keys: ['key1', 'key2'],
      cookie: {
          secure: true,
          httpOnly: true,
          domain: 'example.com',
          path: 'foo/bar',
          expires: new Date( Date.now() + 10 * 60 * 1000 ),
          bob: 'lewis'
      }
}));

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const router = express.Router();
  console.log(router);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error.pug');
});

module.exports = app;
