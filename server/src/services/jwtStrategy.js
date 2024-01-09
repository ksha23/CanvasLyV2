import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/User';

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

var cookieExtractor = (req) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['x-auth-cookie'];
  }
  return token;
};

// JWT strategy
const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, ExtractJwt.fromAuthHeaderAsBearerToken()]),
    secretOrKey,
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);

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
  },
);

passport.use(jwtLogin);
