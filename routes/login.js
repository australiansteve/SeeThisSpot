var express = require('express');
var http = require('http');
var router = express.Router();
var config = require('./../config.js');

/* GET login. */

router.get('/', function(req, res) {
  console.log("Login to Instagram. Client ID: " + config.instagram.client_id)

  //https://api.instagram.com/oauth/authorize/?client_id=3b0c2cadab27402a90302919d12eeccd&redirect_uri=http://seethisspot.herokuapp.com/login&response_type=code&scope=likes

  var options = {
    host: 'https://api.instagram.com',
    port: 80,
    path: '/oauth/authorize/?client_id='+ config.instagram.client_id +'&redirect_uri='+ config.instagram.redirect_url +'&response_type=code&scope=likes',
    method: 'POST'
  };

  http.request(options, function(instaResponse) {
    console.log('STATUS: ' + instaResponse.statusCode);
    console.log('HEADERS: ' + JSON.stringify(instaResponse.headers));
    instaResponse.setEncoding('utf8');
    instaResponse.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  res.setHeader('Content-Type', 'text/html');
  res.end("<html><body>Hi</body></html>");
});

module.exports = router;
