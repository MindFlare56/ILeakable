var express = require('express');
var router = express.Router();

router.get('/home', function(req, res, next) {
    res.render('main.pug', { title: 'Express' });
});

module.exports = router;