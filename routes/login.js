var express = require('express');
var https = require('https');
var router = express.Router();
var config = require('./../config.js');

/* GET login. */

router.get('/', function(req, res) {
  console.log("Login to Instagram. Client ID: " + config.instagram.client_id)

  //https://api.instagram.com/oauth/authorize/?client_id=3b0c2cadab27402a90302919d12eeccd&redirect_uri=http://seethisspot.herokuapp.com/login&response_type=code&scope=likes
  res.statusCode = 302; 
  res.setHeader("Location", 'https://api.instagram.com/oauth/authorize/?client_id='+ config.instagram.client_id +'&redirect_uri='+ config.instagram.redirect_url +'&response_type=code&scope=likes');
  res.end();

});

module.exports = router;
