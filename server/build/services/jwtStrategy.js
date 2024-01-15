"use strict";

var _passport = _interopRequireDefault(require("passport"));
var _passportJwt = require("passport-jwt");
var _User = _interopRequireDefault(require("../models/User"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;
var cookieExtractor = req => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['x-auth-cookie'];
  }
  return token;
};

// JWT strategy
const jwtLogin = new _passportJwt.Strategy({
  jwtFromRequest: _passportJwt.ExtractJwt.fromExtractors([cookieExtractor, _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()]),
  secretOrKey
}, async (payload, done) => {
  try {
    const user = await _User.default.findById(payload.id);
    if (user) {
      // remove refresh token from user object
      // user.refreshToken = undefined;
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});
_passport.default.use(jwtLogin);
//# sourceMappingURL=jwtStrategy.js.map