const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('main.pug');
});

router.get('/fund', function(req, res) {
    res.render('mainfund.pug');
});

module.exports = router;