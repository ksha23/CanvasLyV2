import { Router } from 'express';
import passport from 'passport';
// const useragent = require('express-useragent');

const router = Router();

// This route is used for logins from mobile devices.
router.post('/google/authcode', passport.authenticate('google-authcode', { session: false }), (req, res) => {
  const token = req.user.generateJWT();
  res.status(200).json({ token });
});

// router.get('/logout', passport.authenticate('google-authcode', { session: false }), (req, res) => {
//   req.logout();
// });

export default router;
