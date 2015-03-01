var express = require('express');
var router = express.Router();
var config = require('./../config.js');

/* GET login. */

router.get('/', function(req, res) {
  console.log("Login to Instagram. Client ID: " + config.instagram.client_id)

  //https://api.instagram.com/oauth/authorize/?client_id=3b0c2cadab27402a90302919d12eeccd&redirect_uri=http://seethisspot.herokuapp.com/login&response_type=code&scope=likes

  res.setHeader('Content-Type', 'text/html');
  res.end("<html><body>Hi</body></html>");
});

module.exports = router;
