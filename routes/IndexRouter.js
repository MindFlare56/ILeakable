const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/login');
});

router.get('/getSession', function(req, res) {
    res.send(req.session.user);
    res.send('awesome');
});

router.get('/setSession', function(req, res) {
    req.session.user = 'admin';
    res.send('done');
});

module.exports = router;
