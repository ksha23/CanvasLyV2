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

// This route is used for logins from mobile devices.
router.post('/google/authcode', _passport.default.authenticate('google-authcode', {
  session: false
}), (req, res) => {
  const token = req.user.generateJWT();
  res.status(200).json({
    token
  });
});

// router.get('/logout', passport.authenticate('google-authcode', { session: false }), (req, res) => {
//   req.logout();
// });
var _default = exports.default = router;
//# sourceMappingURL=googleAuthCode.js.map