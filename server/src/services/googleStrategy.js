import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
const refresh = require('passport-oauth2-refresh');

import User from '../models/User';

const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;

// google strategy
const googleLogin = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const oldUser = await User.findOne({ email: profile.email });

      if (oldUser) {
        return done(null, oldUser);
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const newUser = await new User({
        provider: 'google',
        googleId: profile.id,
        username: `user${profile.id}`,
        email: profile.email,
        name: profile.displayName,
        avatar: profile.picture,
        accessToken: accessToken,
        refreshToken: refreshToken,
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

refresh.use(googleLogin);
passport.use(googleLogin);
