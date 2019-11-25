;'use strict';

var express = require('express');
var router = express.Router();

console.log("?");

router.get('/', function(req, res, next) {
  res.redirect('/login');
});

module.exports = router;
