var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var config = require('./../config.js');
var Instagram = require('./../helpers/instagram.js'); 

/* GET search results page. */

router.get('/', function(req, res) {
  console.log("Perform search with coordinates: " + req.query['lat'] + ", " + req.query['lng'] + ', radius: ' + req.query['searchradius']);
  
  //First, save these search parameters in the session so that we can backfill easier later
  sess = req.session;
  var search = {};
  search.lat = req.query['lat'];
  search.lng = req.query['lng'];
  search.radius = req.query['searchradius'];
  sess.search = search;

  //Next we need to get the latest images for that spot  
  Instagram.performSearch(search.lat, search.lng, search.radius, 'now', function(resultsObj) {

    if (resultsObj.length > 0) {
      //put the time of the last result into the session
      var next_time = resultsObj[resultsObj.length-1].created_time - (resultsObj[resultsObj.length-1].created_time % 60);
      sess.search.next_max_time = next_time;
    }

    res.render('results', { data : resultsObj });

  });

});

/* GET backfill results for a location */

router.get('/backfill', function(req, res) {

  sess = req.session;
  console.log("Backfill: " + JSON.stringify(sess.search) + ", user: " + JSON.stringify(sess.user));

  if (sess.search && sess.user) {
    console.log("Backfilling... " + sess.search.next_max_time);

    //Next we need to get the latest images for that spot  
    Instagram.performSearch(sess.search.lat, sess.search.lng, sess.search.radius, sess.search.next_max_time, function(resultsObj){

      if (resultsObj.length > 0) {
        //put the time of the last result into the session
        var next_time = resultsObj[resultsObj.length-1].created_time - (resultsObj[resultsObj.length-1].created_time % 60);
        sess.search.next_max_time = next_time;
      }
      res.render('results', { data : resultsObj });

    });

  }
  else {
    //TODO: Set error message
    console.log("Shouldn't be able to call backfill!");
    res.render('results', "");
  }
});

/* GET search subscription confirmation - called by IG when . */

router.get('/subscribe', function(req, res) {
  console.log("Got call to confirm a subscription. Mode:" + req.query['hub.mode'] + ", challenge: " + req.query['hub.challenge'] + ", token: " + req.query['hub.verifyToken']);
  res.setHeader('Content-Type', 'application/json');
  res.end(req.query['hub.challenge']);
});

module.exports = router;
