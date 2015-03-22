var Instagram = function() {

  var https = require('https');
  var querystring = require('querystring');
  var config = require('./../config.js');

  var createGeoSubscription = function(lat, lng, radius, callback) {

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
      'count' : '20',
      'client_id' : config.instagram.client_id
    });

    if (max_time != 'now')
    {
      get_data += '&' + querystring.stringify({
        'max_time' : new Date().getTime()
      });
    }

    //Attach the search parameters to the end of the path using querystring
    var get_path = '/v1/media/search?' + get_data;
    console.log("GET path for search: " + get_path);

    https.get('https://api.instagram.com' + get_path, function(get_res) {

      var data = '';
      get_res.setEncoding('utf8');

      get_res.on('data', function(d) {
        data += d;
      });

      get_res.on('end',function(){
        var obj = JSON.parse(data);
        callback(obj);          
      })

    }).on('error', function(e) {
      console.error(e);
    });

  }

  return {
      createGeoSubscription: createGeoSubscription,
      performSearch: performSearch
  }
}();

module.exports = Instagram;