var express = require('express');
var router = express.Router();

/* GET login. */

/* 
CLIENT ID	3b0c2cadab27402a90302919d12eeccd
CLIENT SECRET	a4937f49a07d4bcd8349b663527062bd
WEBSITE URL	http://seethisspot.herokuapp.com
REDIRECT URI	http://seethisspot.herokuapp.com/login
*/

router.get('/', function(req, res) {
  console.log("Login to Instagram")

  //https://api.instagram.com/oauth/authorize/?client_id=3b0c2cadab27402a90302919d12eeccd&redirect_uri=http://seethisspot.herokuapp.com/login&response_type=code&scope=likes


  res.setHeader('Content-Type', 'text/html');
  res.end("<html><body>Hi</body></html>");
});

module.exports = router;
