var express = require('express');
var http = require('http');
var router = express.Router();
var config = require('./../config.js');

/* GET login_confirm. */

router.get('/', function(req, res) {
  console.log("Login redirect code: " + req.query.code)

});

module.exports = router;
