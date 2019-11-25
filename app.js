var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

// home page route (http://localhost:8080)
router.get('/login', function(req, res) {
  res.render('login.pug');
});
router.get('/', function(req, res) {
  res.render('login.pug');
});
router.post('/submit-login', function(req, res) {
  res.redirect('/main');
});
router.post('/submit-register', function(req, res) {
  res.redirect('/');
});
router.get('/main', function(req, res) {
  res.render('main.pug');
});
router.get('/mainfund', function(req, res) {
  res.render('mainfund.pug');
});

// apply the routes to our application
app.use('/', router);

//let indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
//let mainRouter = require('./routes/main');

//app.use('/', indexRouter);
app.use('/login', loginRouter);
//app.use('/home', mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {var router = express.Router();
  console.log(router);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.pug');
});

module.exports = app;
