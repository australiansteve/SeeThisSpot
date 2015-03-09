var config = {}

config.instagram = {};

config.instagram.client_id = process.env.INSTA_CLIENT_ID || '<instagram_client_id>';
config.instagram.client_secret =  process.env.INSTA_CLIENT_SECRET|| '<instagram_client_secret>';
config.instagram.website_url = 'http://seethisspot.herokuapp.com';
config.instagram.redirect_url = 'http://seethisspot.herokuapp.com/loginredirect';

module.exports = config;