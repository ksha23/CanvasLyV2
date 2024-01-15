"use strict";

var _passport = _interopRequireDefault(require("passport"));
var _User = _interopRequireDefault(require("../models/User"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
require('dotenv').config();
const GoogleAuthCodeStrategy = require('passport-google-authcode').Strategy;
const refresh = require('passport-oauth2-refresh');
const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;
const googleAuthCodeLogin = new GoogleAuthCodeStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const oldUser = await _User.default.findOne({
      email: profile._json.email
    });
    if (oldUser) {
      // remove refresh token from user object
      // oldUser.refreshToken = undefined;
      return done(null, oldUser);
    }
    const newUser = await new _User.default({
      provider: 'google',
      googleId: profile.id,
      username: `user${profile.id}`,
      email: profile._json.email,
      name: profile.displayName,
      avatar: profile._json.picture,
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenExpiresAt: new Date().getTime() + 3599 * 1000
    }).save();

    // remove refresh token from user object
    // newUser.refreshToken = undefined;
    done(null, newUser);
  } catch (err) {
    console.log(err);
  }
});
_passport.default.use(googleAuthCodeLogin);
refresh.use(googleAuthCodeLogin);
//# sourceMappingURL=googleAuthCodeStrategy.js.map