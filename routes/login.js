var express = require('express');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var router = express.Router();
var config = require('./../config.js');

/* GET login. */

router.get('/', function(req, res) {

  if (req.query.error === 'access_denied')
  {
    //Authentication has been denied by the user
    console.log("Authentication denied by user. " + req.query.error + ". " + req.query.error_reason + ". " + req.query.error_description);

    res.statusCode = 302; 
    res.setHeader("Location", config.base_url);
    res.end();
  }
  else if (req.query.code)
  {
    //Getting callback from IG
    console.log("Authentication code: " + req.query.code);

    // Build the post string from an object
    var post_data = querystring.stringify({
      'client_id' : config.instagram.client_id,
      'client_secret': config.instagram.client_secret,
      'grant_type': 'authorization_code',
      'redirect_uri' : config.instagram.redirect_url,
      'code' : req.query.code
    });

    // An object of options to indicate where to post to
    var post_options = {
        host: 'api.instagram.com',
        port: '443',
        path: '/oauth/access_token',
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

          console.log('Response: ' + JSON.stringify(obj));
          
          if(obj.access_token)
          {
            console.log("Authentication complete");
            sess = req.session;
            sess.access_token = obj.access_token;
            sess.user = obj.user;

            res.redirect( config.base_url + "?login=true");
          }
          else if (obj.error_type)
          {
            console.error("Authentication error");

            res.redirect(config.base_url + "?login=false");
          }
          else
          {
            console.warn("Authentication unknown response");

            res.redirect(config.base_url + "?login=unknown");
          }
        })

        post_res.on('data', function (chunk) {
            data += chunk;
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

  }
  else if (req.query.complete)
  {
  }
  else
  {
    //Starting authentication process
    console.log("Login to Instagram. Client ID: " + config.instagram.client_id);

    res.redirect('https://api.instagram.com/oauth/authorize/?client_id='+ config.instagram.client_id +'&redirect_uri='+ config.instagram.redirect_url +'&response_type=code&scope=likes');
  }


});


/* GET logout. */

router.get('/logout', function(req, res) {
    sess = req.session;

    if (sess.access_token || sess.user)
    {
      console.log("Logging out of Instagram: " + sess.user.username);
      req.session.destroy(function () {
          res.redirect(config.base_url + "?logout=loggedout");
      });

    }
    else {
      res.redirect(config.base_url + "?logout=notrequired");
    }

});

module.exports = router;
