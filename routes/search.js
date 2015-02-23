var express = require('express');
var router = express.Router();

/* POST search results page. */

router.post('/', function(req, res) {
  console.log("Perform search with coordinates: " + req.body.lat + ", " + req.body.lng + ', radius: ' + req.body.searchradius)
  //res.render('results', { title: 'SeeThisSpot: Search results', radius: req.body.searchradius, lat: req.body.lat, lng: req.body.lng });
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ results: '1' }));
});

module.exports = router;
