require('dotenv').config();
const GoogleAuthCodeStrategy = require('passport-google-authcode').Strategy;
import passport from 'passport';
import User from '../models/User';
const refresh = require('passport-oauth2-refresh');

const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;

const googleAuthCodeLogin = new GoogleAuthCodeStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
  },
  async (accessToken, refreshToken, profile, done) => {
    // console.log('params', params);
    try {
      const oldUser = await User.findOne({ email: profile._json.email });

      if (oldUser) {
        // remove refresh token from user object
        // oldUser.refreshToken = undefined;
        return done(null, oldUser);
      }

      const newUser = await new User({
        provider: 'google',
        googleId: profile.id,
        username: `user${profile.id}`,
        email: profile._json.email,
        name: profile.displayName,
        avatar: profile._json.picture,
        accessToken,
        refreshToken,
        tokenExpiresAt: new Date().getTime() + 3599 * 1000,
      }).save();

      // remove refresh token from user object
      // newUser.refreshToken = undefined;
      done(null, newUser);
    } catch (err) {
      console.log(err);
    }
  },
);

passport.use(googleAuthCodeLogin);
refresh.use(googleAuthCodeLogin);
