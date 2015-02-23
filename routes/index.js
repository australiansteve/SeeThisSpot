var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'SeeThisSpot.com', radius: '500', zoom: '14' });
});

module.exports = router;
