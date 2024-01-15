"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _passport = _interopRequireDefault(require("passport"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// const useragent = require('express-useragent');

const router = (0, _express.Router)();
router.get('/google', _passport.default.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
  prompt: 'select_account',
  accessType: 'offline'
}));
const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;
router.get('/google/callback', _passport.default.authenticate('google', {
  failureRedirect: '/',
  session: false
}), (req, res) => {
  const token = req.user.generateJWT();
  res.cookie('x-auth-cookie', token, {
    maxAge: 1000 * 60 * 60 * 12,
    // 12 hours
    httpOnly: true,
    // very important
    secure: process.env.NODE_ENV === 'production'
  });
  res.redirect(clientUrl);
});
router.get('/logout', (req, res) => {
  req.logout(); // this is a passport function
  res.clearCookie('x-auth-cookie'); // very important to clear the cookie
  res.send(false);
});
var _default = exports.default = router;
//# sourceMappingURL=googleAuth.js.map