import { Router } from 'express';
import passport from 'passport';
const useragent = require('express-useragent');

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
    prompt: 'select_account',
    accessType: 'offline',
  }),
);

const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const token = req.user.generateJWT();

    const isReactNative = req.header('x-react-native') && useragent.parse(req.headers['user-agent']).isMobile;
    if (isReactNative) {
      res.send(token);
      return;
    }

    // if not react native, set cookie and redirect to client
    res.cookie('x-auth-cookie', token, {
      maxAge: 1000 * 60 * 60 * 12, // 6 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.redirect(clientUrl);
  },
);

router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('x-auth-cookie');
  res.send(false);
});

export default router;
