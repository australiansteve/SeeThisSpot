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

    var resultsObj = JSON.parse(results);

    //put the time of the last result into the session to make backfilling quicker later
    sess.search.min_time = resultsObj.data[resultsObj.data.length-1].created_time;

    //res.setHeader('Content-Type', 'text/html');
    //res.render('index', { title: 'SeeThisSpot.com', radius: '500', zoom: '14', lat: 'current', lng: 'current' });

    res.render('results', { data : resultsObj.data });
    //res.end();

  });

});

router.get ('/render', function(req, res) {

  var results = [
  {
    "attribution": null,
    "tags": [],
    "location": {
      "latitude": -31.949213002,
      "name": "Night Noodle Markets",
      "longitude": 115.859812126,
      "id": 671626819
    },
    "comments": {
      "count": 0,
      "data": []
    },
    "filter": "Normal",
    "created_time": "1427110671",
    "link": "https://instagram.com/p/0kZ05wRuwj/",
    "likes": {
      "count": 1,
      "data": [
        {
          "username": "billj_93",
          "profile_picture": "https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xap1/t51.2885-19/10665600_641758685921480_917233081_a.jpg",
          "id": "50347193",
          "full_name": "Bill Jefferies"
        }
      ]
    },
    "images": {
      "low_resolution": {
        "url": "http://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s306x306/e15/11049329_1638695139680029_2127416043_n.jpg",
        "width": 306,
        "height": 306
      },
      "thumbnail": {
        "url": "http://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s150x150/e15/11049329_1638695139680029_2127416043_n.jpg",
        "width": 150,
        "height": 150
      },
      "standard_resolution": {
        "url": "http://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11049329_1638695139680029_2127416043_n.jpg",
        "width": 640,
        "height": 640
      }
    },
    "users_in_photo": [],
    "caption": {
      "created_time": "1427110671",
      "text": "Noodles for days 👲🍜 @karlglauch",
      "from": {
        "username": "emily___gardner",
        "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10666203_1464062680541625_1006681744_a.jpg",
        "id": "281914538",
        "full_name": "Emily Gardner"
      },
      "id": "946995408386059612"
    },
    "type": "image",
    "id": "946995408243452963_281914538",
    "user": {
      "username": "emily___gardner",
      "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10666203_1464062680541625_1006681744_a.jpg",
      "id": "281914538",
      "full_name": "Emily Gardner"
    }
  },
  {
    "attribution": null,
    "tags": [
      "eatdrinkperth"
    ],
    "location": {
      "latitude": -31.950003687,
      "longitude": 115.860688219
    },
    "comments": {
      "count": 0,
      "data": []
    },
    "filter": "Crema",
    "created_time": "1427110538",
    "link": "https://instagram.com/p/0kZksiTJq7/",
    "likes": {
      "count": 0,
      "data": []
    },
    "images": {
      "low_resolution": {
        "url": "http://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s306x306/e15/11078302_431203297041309_101070462_n.jpg",
        "width": 306,
        "height": 306
      },
      "thumbnail": {
        "url": "http://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/11078302_431203297041309_101070462_n.jpg",
        "width": 150,
        "height": 150
      },
      "standard_resolution": {
        "url": "http://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11078302_431203297041309_101070462_n.jpg",
        "width": 640,
        "height": 640
      }
    },
    "users_in_photo": [
      {
        "position": {
          "y": 0.684375,
          "x": 0.378125
        },
        "user": {
          "username": "katrinsveinbjornsson",
          "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10843667_394323840727397_118239740_a.jpg",
          "id": "28090639",
          "full_name": ""
        }
      },
      {
        "position": {
          "y": 0.696875,
          "x": 0.1296875
        },
        "user": {
          "username": "helensb_",
          "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10914496_615354918594262_864504969_a.jpg",
          "id": "42563566",
          "full_name": "Helen Brenchley"
        }
      },
      {
        "position": {
          "y": 0.590625,
          "x": 0.90625
        },
        "user": {
          "username": "ebonymr",
          "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/1516505_1560367667544633_49542047_a.jpg",
          "id": "23215283",
          "full_name": "💯 champagne mami 💯"
        }
      }
    ],
    "caption": {
      "created_time": "1427110538",
      "text": "Kat lovin the food #eatdrinkperth",
      "from": {
        "username": "_coralrose",
        "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_1116884901_75sq_1393131237.jpg",
        "id": "1116884901",
        "full_name": "Coral Nicolas"
      },
      "id": "946994294781942077"
    },
    "type": "image",
    "id": "946994294538672827_1116884901",
    "user": {
      "username": "_coralrose",
      "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_1116884901_75sq_1393131237.jpg",
      "id": "1116884901",
      "full_name": "Coral Nicolas"
    }
  }];

  res.render('results', {data : results})
})


/* GET backfill results for a location */

router.get('/backfill', function(req, res) {

  sess = req.session;
  //TODO: check that sess.search exists - otherwise return gracefully

  //Next we need to get the latest images for that spot  
  Instagram.performSearch(sess.search.lat, sess.search.lng, sess.search.radius, sess.search.min_time, function(results){

    var resultsObj = JSON.parse(results);

    //put the time of the last result into the session to make backfilling quicker later
    sess.search.min_time = resultsObj.data[resultsObj.data.length-1].created_time;

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
