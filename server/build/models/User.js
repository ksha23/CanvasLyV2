"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.hashPassword = hashPassword;
exports.validateUser = void 0;
var _fs = _interopRequireWildcard(require("fs"));
var _path = require("path");
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _joi = _interopRequireDefault(require("joi"));
var _utils = require("../utils/utils");
var _constants = require("../utils/constants");
var _lazy = require("joi/lib/types/lazy");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const {
  Schema
} = _mongoose.default;
const userSchema = new Schema({
  provider: {
    type: String,
    required: true
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  password: {
    type: String,
    trim: true,
    minlength: 6,
    maxlength: 60
  },
  name: String,
  avatar: String,
  role: {
    type: String,
    default: 'USER'
  },
  bio: String,
  // google
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  // fb
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  messages: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  accessToken: {
    type: String
  },
  tokenExpiresAt: {
    type: Date
  },
  refreshToken: {
    type: String,
    required: true
  },
  calendarId: {
    type: String,
    default: ''
  },
  dueDateWeight: {
    type: Number,
    default: 0
  },
  difficultyWeight: {
    type: Number,
    default: 0
  },
  typeWeight: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// console.log(join(__dirname, '../..', IMAGES_FOLDER_PATH));

userSchema.methods.toJSON = function () {
  // if not exists avatar1 default
  const absoluteAvatarFilePath = `${(0, _path.join)(__dirname, '../..', _constants.IMAGES_FOLDER_PATH)}${this.avatar}`;
  const avatar = (0, _utils.isValidUrl)(this.avatar) ? this.avatar : _fs.default.existsSync(absoluteAvatarFilePath) ? `${_constants.IMAGES_FOLDER_PATH}${this.avatar}` : `${_constants.IMAGES_FOLDER_PATH}avatar2.jpg`;
  return {
    id: this._id,
    provider: this.provider,
    email: this.email,
    username: this.username,
    avatar: avatar,
    name: this.name,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    weights: [this.dueDateWeight, this.difficultyWeight, this.typeWeight],
    calendarId: this.calendarId
  };
};
const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;
userSchema.methods.generateJWT = function () {
  const token = _jsonwebtoken.default.sign({
    expiresIn: '12h',
    // 12 hours
    id: this._id,
    provider: this.provider,
    email: this.email
  }, secretOrKey);
  return token;
};
userSchema.methods.registerUser = (newUser, callback) => {
  _bcryptjs.default.genSalt(10, (err, salt) => {
    _bcryptjs.default.hash(newUser.password, salt, (errh, hash) => {
      if (err) {
        console.log(err);
      }
      // set pasword to hash
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  _bcryptjs.default.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// const delay = (t, ...vs) => new Promise(r => setTimeout(r, t, ...vs)) or util.promisify(setTimeout)

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    _bcryptjs.default.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);else resolve(hash);
    });
  });
  return hashedPassword;
}
const validateUser = user => {
  const schema = {
    avatar: _joi.default.any(),
    name: _joi.default.string().min(2).max(30).required(),
    username: _joi.default.string().min(2).max(20).regex(/^[a-zA-Z0-9_]+$/).required(),
    password: _joi.default.string().min(6).max(20).allow('').allow(null),
    calendarId: _joi.default.string(),
    dueDateWeight: _joi.default.number().min(0).max(10),
    difficultyWeight: _joi.default.number().min(0).max(10),
    typeWeight: _joi.default.number().min(0).max(10)
  };
  return _joi.default.validate(user, schema);
};
exports.validateUser = validateUser;
const User = _mongoose.default.model('User', userSchema);
var _default = exports.default = User;
//# sourceMappingURL=User.js.map