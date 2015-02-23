var express = require('express');
var router = express.Router();

/* POST search results page. */

router.post('/', function(req, res) {
  console.log("Perform search with coordinates: " + req.body.lat + ", " + req.body.lng)
  res.render('results', { title: 'SeeThisSpot: Search results', radius: req.body.searchradius });
});

module.exports = router;
