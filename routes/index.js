var express = require('express');
var path = require('path');
var router = express.Router();
var Instagram = require('./../helpers/instagram.js'); 

var app = express();
app.set('views', app.get('views'));
app.set('view engine', 'jade');

/* GET home page. */

router.get('/', function(req, res) {
  sess = req.session;

  if (sess.user) {

  	//Next we need to get the latest images for that spot  
  	Instagram.performSearch(sess.search.lat, sess.search.lng, sess.search.radius, 'now', sess.access_token, function(resultsObj){

      if (resultsObj.length > 0) {
        //put the time of the last result into the session
        var next_time = resultsObj[resultsObj.length-1].created_time - (resultsObj[resultsObj.length-1].created_time % 60);
        sess.search.next_max_time = next_time;
      }
      
      app.render('results', { data : resultsObj } , function(err, html) {
        if (err) {
          console.log(err);
        }
        else {
          res.render('index_loggedin', { title: 'SeeThisSpot.com', 
                                        radius: sess.search.radius, 
                                        zoom: '14', 
                                        lat: sess.search.lat, 
                                        lng: sess.search.lng, 
                                        username: sess.user.username,
                                        results :  html
          });
        }
      });
    });
  }
  else {
  	res.render('index', { title: 'SeeThisSpot.com', radius: '500', zoom: '14', lat: 'current', lng: 'current' });
  }

});

module.exports = router;
