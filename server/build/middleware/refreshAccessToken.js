"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _passportOauth2Refresh = _interopRequireDefault(require("passport-oauth2-refresh"));
var _User = _interopRequireDefault(require("../models/User"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Middleware to check if the access token is about to expire
const refreshTokenMiddleware = async (req, res, next) => {
  const tokenExpirationBuffer = 60000; // 1 minute buffer for token expiration

  if (req.user && req.user.tokenExpiresAt && new Date(req.user.tokenExpiresAt) - tokenExpirationBuffer < Date.now()) {
    _passportOauth2Refresh.default.requestNewAccessToken('google-authcode', req.user.refreshToken, async (err, accessToken, refreshToken) => {
      if (err) {
        console.error('Error refreshing token:', err);
        return next(err);
      }
      if (!accessToken) {
        console.error('Access token not received after refresh.');
        // Handle this case, possibly by forcing reauthorization or another approach.
        return next(new Error('Failed to obtain a new access token.'));
      }
      let userForUpdate = {
        accessToken,
        tokenExpiresAt: new Date().getTime() + 3600000 // adds 1 hour to current time
      };
      if (refreshToken) {
        userForUpdate.refreshToken = refreshToken;
      }
      try {
        await _User.default.findByIdAndUpdate(req.user._id, userForUpdate);
        req.user.accessToken = accessToken; // Update the access token in the user object immediately
        req.user.tokenExpiresAt = userForUpdate.tokenExpiresAt; // Update the token expiration time in the user object immediately
        req.user.refreshToken = refreshToken || req.user.refreshToken; // Update the refresh token in the user object immediately
        next();
      } catch (updateErr) {
        console.error('Error updating user:', updateErr);
        next(updateErr);
      }
    });
  } else {
    next();
  }
};
var _default = exports.default = refreshTokenMiddleware;
//# sourceMappingURL=refreshAccessToken.js.map