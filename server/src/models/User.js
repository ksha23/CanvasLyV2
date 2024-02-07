import fs, { access } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../utils/utils';
import { IMAGES_FOLDER_PATH } from '../utils/constants';
import { required } from 'joi/lib/types/lazy';
import { type } from 'joi/lib/types/object';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    name: String,
    avatar: String,
    role: { type: String, default: 'USER' },
    bio: String,
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    accessToken: {
      type: String,
    },
    tokenExpiresAt: {
      type: Date,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    canvasAPIToken: {
      type: String,
      default: '',
    },
    canvasAPIUrl: {
      type: String,
      default: '',
    },
    calendarId: {
      type: String,
      default: '',
    },
    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Course',
      default: [],
    },
    dueDateWeight: {
      type: Number,
      default: 0,
    },
    difficultyWeight: {
      type: Number,
      default: 0,
    },
    typeWeight: {
      type: Number,
      default: 0,
    },
    pointsWeight: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// console.log(join(__dirname, '../..', IMAGES_FOLDER_PATH));

userSchema.methods.toJSON = function () {
  // if not exists avatar1 default
  const absoluteAvatarFilePath = `${join(__dirname, '../..', IMAGES_FOLDER_PATH)}${this.avatar}`;
  const avatar = isValidUrl(this.avatar)
    ? this.avatar
    : fs.existsSync(absoluteAvatarFilePath)
    ? `${IMAGES_FOLDER_PATH}${this.avatar}`
    : `${IMAGES_FOLDER_PATH}avatar2.jpg`;

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
    calendarId: this.calendarId,
    canvasAPIToken: this.canvasAPIToken,
    canvasAPIUrl: this.canvasAPIUrl,
  };
};

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      expiresIn: '12h', // 12 hours
      id: this._id,
      provider: this.provider,
      email: this.email,
    },
    secretOrKey,
  );
  return token;
};

userSchema.methods.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errh, hash) => {
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
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// const delay = (t, ...vs) => new Promise(r => setTimeout(r, t, ...vs)) or util.promisify(setTimeout)

export async function hashPassword(password) {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });

  return hashedPassword;
}

export const validateUser = (user) => {
  const schema = {
    avatar: Joi.any(),
    name: Joi.string().min(2).max(30).required(),
    username: Joi.string()
      .min(2)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/)
      .required(),
    password: Joi.string().min(6).max(20).allow('').allow(null),
    calendarId: Joi.string(),
    dueDateWeight: Joi.number().min(0).max(10),
    difficultyWeight: Joi.number().min(0).max(10),
    typeWeight: Joi.number().min(0).max(10),
    canvasAPIToken: Joi.string(),
    canvasAPIUrl: Joi.string(),
  };

  return Joi.validate(user, schema);
};

const User = mongoose.model('User', userSchema);

export default User;
