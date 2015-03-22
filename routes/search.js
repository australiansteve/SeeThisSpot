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
  Instagram.performSearch(search.lat, search.lng, search.radius, 'now', function(results) {

    //console.log('Search results: ' + JSON.stringify(results));
    
    //put the time of the last result into the session to make backfilling quicker later
    sess.search.min_time = results.data[results.data.length-1].created_time;

    res.setHeader('Content-Type', 'application/json');
    res.end(results);

  });

});


/* GET backfill results for a location */

router.get('/backfill', function(req, res) {

  sess = req.session;
  //TODO: check that sess.search exists - otherwise return gracefully

  //Next we need to get the latest images for that spot  
  Instagram.performSearch(sess.search.lat, sess.search.lng, sess.search.radius, sess.search.min_time, function(results){

    //console.log('Backfill results: ' + JSON.stringify(results));
    
    //put the time of the last result into the session to make backfilling quicker later
    sess.search.min_time = results.data[results.data.length-1].created_time;

    res.setHeader('Content-Type', 'application/json');
    res.end(results);

  });

});

/* GET search subscription confirmation - called by IG when . */

router.get('/subscribe', function(req, res) {
  console.log("Got call to confirm a subscription. Mode:" + req.query['hub.mode'] + ", challenge: " + req.query['hub.challenge'] + ", token: " + req.query['hub.verifyToken']);
  res.setHeader('Content-Type', 'application/json');
  res.end(req.query['hub.challenge']);
});

module.exports = router;
