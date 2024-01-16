import { Router } from 'express';
import multer from 'multer';
import { resolve } from 'path';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import refreshTokenMiddleware from '../../middleware/refreshAccessToken';
import User, { hashPassword, validateUser } from '../../models/User';

const router = Router();

// integrate set setCalendarId, setWeights into route
// all calendars can be fetched elsewhere

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, '../../../public/images'));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `avatar-${Date.now()}-${fileName}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

//`checkit`, which is probably the option I'd suggest if  `validatem`

router.put('/:id', [requireJwtAuth, upload.single('avatar')], async (req, res, next) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privileges to edit this user.' });

    //validate name, username and password
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let avatarPath = null;
    if (req.file) {
      avatarPath = req.file.filename;
    }

    // if fb or google user provider dont update password
    let password = null;
    if (req.user.provider === 'email' && req.body.password && req.body.password !== '') {
      password = await hashPassword(req.body.password);
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.id !== tempUser.id) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const updatedUser = {
      avatar: avatarPath,
      name: req.body.name,
      username: req.body.username,
      password,
      calendarId: req.body.calendarId,
      dueDateWeight: req.body.dueDateWeight,
      difficultyWeight: req.body.difficultyWeight,
      typeWeight: req.body.typeWeight,
    };
    // remove '', null, undefined
    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    // console.log(req.body, updatedUser);

    const user = await User.findByIdAndUpdate(tempUser.id, { $set: updatedUser }, { new: true });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/me', requireJwtAuth, (req, res) => {
  const me = req.user.toJSON();
  res.json({ me });
});

router.get('/:username', requireJwtAuth, refreshTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'No user found.' });
    user.refreshToken = undefined;
    user.accessToken = undefined;

    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    });
    const data = await response.json();
    const items = data.items;
    const calendarData = items.map((item) => {
      return {
        id: item.id,
        summary: item.summary,
      };
    });

    const final = user.toJSON();
    // add calendar data
    final.calendars = calendarData;

    // res.json({ user: user.toJSON() });
    res.json({ user: final });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/', requireJwtAuth, async (req, res) => {
  // verify user is admin
  if (req.user.role !== 'ADMIN') return res.status(400).json({ message: 'You are not admin.' });
  try {
    const users = await User.find().sort({ createdAt: 'desc' });

    res.json({
      users: users.map((m) => {
        return m.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
