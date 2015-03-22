var Instagram = function() {

  var https = require('https');
  var querystring = require('querystring');
  var config = require('./../config.js');

  var createGeography = function(lat, lng, radius, callback) {

    // Build the post string from an object
    var post_data = querystring.stringify({
      'client_id' : config.instagram.client_id,
      'client_secret': config.instagram.client_secret,
      'object': 'geography',
      'aspect' : 'media',
      'lat' : lat,
      'lng' : lng,
      'radius' : radius,
      'callback_url' : config.base_url + "/search/subscribe"
    });

    // An object of options to indicate where to post to
    var post_options = {
        host: 'api.instagram.com',
        port: '443',
        path: '/v1/subscriptions/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var post_req = https.request(post_options, function(post_res) {

      var data = '';
      post_res.setEncoding('utf8');

      post_res.on('end',function(){
        var obj = JSON.parse(data);

        callback(obj);          
      })

      post_res.on('data', function (chunk) {
          data += chunk;
      });

    });

    // post the data
    post_req.write(post_data);
    post_req.end();

  }

  var performSearch = function(lat, lng, radius, max_time, callback) {

    //GET
    //https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&client_id=YOUR-CLIENT_IDs
    
    // Build the querystring from an object
    var get_data = querystring.stringify({
      'lat' : lat,
      'lng' : lng,
      'distance' : radius,
      'max_time' : max_time,
      'client_id' : config.instagram.client_id
    });

    var get_path = '/v1/media/search' + get_data;
    console.log("GET path for search: " + get_path);

    // An object of options to indicate where to post to
    var get_options = {
        host: 'api.instagram.com',
        port: '443',
        path: get_path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': get_data.length
        }
    };

    // Set up the request
    var get_req = https.request(get_options, function(get_res) {

      var data = '';
      get_res.setEncoding('utf8');

      get_res.on('end',function(){
        console.log("Finished search: " + data);
        callback(data);          
      })

      get_res.on('data', function (chunk) {
          data += chunk;
      });

    });

    // post the data
    //get_req.write(get_data);
    get_req.end();

  }

  var backfill = function(token, lat, lng, radius, max_time) {
      //perform backfill search
      //https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&access_token=21793052.f59def8.9419bf1fad7b447eb2c5e9a6fd4ae19b

      return "";
  }

  return {
      createGeography: createGeography,
      performSearch: performSearch,
      backfill: backfill
  }
}();

module.exports = Instagram;