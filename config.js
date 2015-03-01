var config = {}

config.instagram = {};

config.instagram.client_id = process.env.INSTA_CLIENT_ID || 'clientId';
config.instagram.client_secret =  process.env.INSTA_CLIENT_SECRET|| 'clientSecret';
config.instagram.website_url = 'http://mywebsite.com';
config.instagram.redirect_url = 'http://mywebsite.com/redirect';

module.exports = config;