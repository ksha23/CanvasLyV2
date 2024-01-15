"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _googleAuth = _interopRequireDefault(require("./googleAuth"));
var _googleAuthCode = _interopRequireDefault(require("./googleAuthCode"));
var _api = _interopRequireDefault(require("./api"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = (0, _express.Router)();

// router.use('/auth', localAuthRoutes);
router.use('/auth', _googleAuth.default);
router.use('/auth', _googleAuthCode.default);
// router.use('/auth', facebookAuthRoutes);
router.use('/api', _api.default);
// fallback 404
router.use('/api', (req, res) => res.status(404).json('No route for this path'));
var _default = exports.default = router;
/*
routes:

GET /auth/google
GET /auth/google/callback

GET /auth/facebook
GET /auth/facebook/callback

POST /auth/login
POST /auth/register
GET /auth/logout

GET api/users/me
GET /api/users/feature

*/
//# sourceMappingURL=index.js.map