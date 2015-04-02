var Instagram = function() {

  var async = require('async');
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

  var performSearch = function(lat, lng, radius, max_time, searchCallback) {

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
    
    //Add date ranges - 604800 = 7 days, the maximum range that Instagram allows
    if (max_time == 'now')
    {
      max_time = new Date().getTime() / 1000; //Need seconds not milliseconds
    }
    var min_time = max_time;

    //Attach the search parameters to the end of the path using querystring
    var get_path = '/v1/media/search?' + get_data;
    
    var resultsToReturn = [];
    var count = 0;

    async.whilst(
      function () { return  (resultsToReturn.length < 20) && (count < 52); },
      function (callback) {
        count++;
        max_time = min_time - 1;
        min_time = max_time - 604800; //Subtract 7 days

        timeQS = '&' + querystring.stringify({
          'max_timestamp' : max_time,
          'min_timestamp' : min_time
        });
        
        var next_url = 'https://api.instagram.com' + get_path + timeQS;
        console.log(count + " GET from: " + next_url);

        https.get(next_url, function(get_res) {

          var data = '';
          get_res.setEncoding('utf8');

          get_res.on('data', function(d) {
            data += d;
          });

          get_res.on('end',function(){
            var dataObj = JSON.parse(data);
            resultsToReturn = resultsToReturn.concat(dataObj.data);
            console.log(resultsToReturn.length + " results so far : " + (resultsToReturn.length < 20) + " and " + (count < 52));
          })

        }).on('error', function(e) {
          console.error(e);
        });

        setTimeout(callback, (1000/count)>100 ? 1000/count : 100); //Always at least 100ms. First 4 cycles will have slightly longer gaps, if no results found by then the chances of more are slimmer
      },
      function (err) {
        if (!err) {
          console.log("Finished performSearch - should have at least 20 results");
          searchCallback(resultsToReturn);
        }
        else {
          console.log("Error performing search: " + err);
        }
      }
    );
    
    console.log("End performSearch");
  }

  return {
      createGeoSubscription: createGeoSubscription,
      performSearch: performSearch
  }
}();

module.exports = Instagram;