var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var config = require('./../config.js');

/* POST search results page. */

router.get('/', function(req, res) {
  console.log("Perform search with coordinates: " + req.query['lat'] + ", " + req.query['lng'] + ', radius: ' + req.query['searchradius']);
  
  // Build the post string from an object
  var post_data = querystring.stringify({
    'client_id' : config.instagram.client_id,
    'client_secret': config.instagram.client_secret,
    'object': 'geography',
    'aspect' : 'media',
    'lat' : req.query['lat'],
    'lng' : req.query['lng'],
    'radius' : req.query['searchradius'],
    'callback_url' : config.base_url + "/search/subscribe"
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'api.instagram.com',
      port: '443',
      path: '/v1/subscriptions/',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
      }
  };

  // Set up the request
  var post_req = https.request(post_options, function(post_res) {

    var data = '';
    post_res.setEncoding('utf8');

    post_res.on('end',function(){
      var obj = JSON.parse(data);

      console.log('Response: ' + JSON.stringify(obj));
      
      //'obj' is the subscription object which contains a geography ID.
      //Next we need to get the latest images for that geoID
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(obj));
    })

    post_res.on('data', function (chunk) {
        data += chunk;
    });

  });

  // post the data
  post_req.write(post_data);
  post_req.end();

});

router.get('/subscribe', function(req, res) {
  console.log("Got call to confirm a subscription. Mode:" + req.query['hub.mode'] + ", challenge: " + req.query['hub.challenge'] + ", token: " + req.query['hub.verifyToken']);
  res.setHeader('Content-Type', 'application/json');
  res.end(req.query['hub.challenge']);
});

module.exports = router;
