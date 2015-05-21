var config = {}

config.base_url = process.env.INSTA_URL || 'http://seethisspot.com';
config.session_secret = process.env.SESSION_SECRET || 'abc123';

config.instagram = {};

config.instagram.client_id = process.env.INSTA_CLIENT_ID || '<instagram_client_id>';
config.instagram.client_secret =  process.env.INSTA_CLIENT_SECRET || '<instagram_client_secret>';
config.instagram.website_url = process.env.INSTA_URL || 'http://seethisspot.com';
config.instagram.redirect_url = process.env.INSTA_REDIRECT_URL ||'http://seethisspot.com/login?complete';

module.exports = config;