var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var config = require('./../config.js');
var Instagram = require('./../helpers/instagram.js'); 

/* GET search results page. */

router.get('/', function(req, res) {
  console.log("Perform search with coordinates: " + req.query['lat'] + ", " + req.query['lng'] + ', radius: ' + req.query['searchradius']);
  
  Instagram.createGeography(req.query['lat'], req.query['lng'], req.query['searchradius'], function(createdGeo) {

    console.log('Response: ' + JSON.stringify(createdGeo));
    
    if (createdGeo.meta.code = '200') {
      //Success
      //First, save these search parameters in the session so that we can backfill easier later
      sess = req.session;
      var search = {};
      search.geo_id = createdGeo.data.object_id;
      search.lat = req.query['lat'];
      search.lng = req.query['lng'];
      search.radius = req.query['searchradius'];
      sess.search = search;

      //Next we need to get the latest images for that geoID  
      Instagram.performSearch(search.geo_id, function(results){

        console.log('Search results: ' + results);
        res.setHeader('Content-Type', 'application/json');
        res.end(results);

      });

    }
    else {
      //Some sort of error
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(createdGeo));
    }

  });

});

/* GET search subscription confirmation - called by IG when . */

router.get('/perform', function(req, res) {
  sess = req.session;
  console.log("Got call to perform a search. Geography ID:" + sess.search.geo_id);
  //https://api.instagram.com/v1/geographies/{geo-id}/media/recent?client_id=YOUR-CLIENT_IDs

  res.setHeader('Content-Type', 'application/json');
  res.end(req.query['hub.challenge']);
});

/* GET search subscription confirmation - called by IG when . */

router.get('/subscribe', function(req, res) {
  console.log("Got call to confirm a subscription. Mode:" + req.query['hub.mode'] + ", challenge: " + req.query['hub.challenge'] + ", token: " + req.query['hub.verifyToken']);
  res.setHeader('Content-Type', 'application/json');
  res.end(req.query['hub.challenge']);
});

module.exports = router;
