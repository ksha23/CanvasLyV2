"use strict";

var _passport = _interopRequireDefault(require("passport"));
var _passportGoogleOauth = require("passport-google-oauth2");
var _User = _interopRequireDefault(require("../models/User"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const refresh = require('passport-oauth2-refresh');
const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;

// google strategy
const googleLogin = new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const oldUser = await _User.default.findOne({
      email: profile.email
    });
    if (oldUser) {
      return done(null, oldUser);
    }
  } catch (err) {
    console.log(err);
  }
  try {
    const newUser = await new _User.default({
      provider: 'google',
      googleId: profile.id,
      username: `user${profile.id}`,
      email: profile.email,
      name: profile.displayName,
      avatar: profile.picture,
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
refresh.use(googleLogin);
_passport.default.use(googleLogin);
//# sourceMappingURL=googleStrategy.js.map