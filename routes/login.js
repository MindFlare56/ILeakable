var express = require('express');
var app = express();
var router = express.Router();

router.get('/login', function(req, res, next) {
    res.render('login.pug');
});

app.post('/submit-login', function(req, res, next) {
    //todo
    res.render('main.pug');
});

app.post('/submit-register', function(req, res, next) {
    //todo
    res.render('login.pug');
});

module.exports = router;
