const express = require('express');
const router = express.Router();

router.get('/1234', function(req, res, next) {
    res.render('login.pug');
});
/*
express.post('/submit-login', function(req, res, next) {
    //todo
    res.render('main.pug');
});

express.post('/submit-register', function(req, res, next) {
    //todo
    res.render('login.pug');
});
*/
module.exports = router;
