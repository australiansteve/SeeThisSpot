var express = require('express');
var router = express.Router();

/* POST search results page. */

router.post('/', function(req, res) {
  res.render('index', { title: 'Search Results' });
});

module.exports = router;
