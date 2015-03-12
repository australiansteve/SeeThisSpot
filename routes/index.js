var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  sess = req.session;

  if (sess.user)
  	res.render('index_loggedin', { title: 'SeeThisSpot.com', radius: '500', zoom: '14', lat: 'current', lng: 'current', username: sess.user.username });
  else
  	res.render('index', { title: 'SeeThisSpot.com', radius: '500', zoom: '14', lat: 'current', lng: 'current' });

});

module.exports = router;
