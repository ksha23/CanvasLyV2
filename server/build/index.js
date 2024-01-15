"use strict";

require("dotenv/config");
var _express = _interopRequireDefault(require("express"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _https = _interopRequireDefault(require("https"));
var _fs = require("fs");
var _path = require("path");
var _passport = _interopRequireDefault(require("passport"));
var _routes = _interopRequireDefault(require("./routes"));
var _cors = _interopRequireDefault(require("cors"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const app = (0, _express.default)();
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use((0, _cookieParser.default)());
app.use(_passport.default.initialize());
require('./services/jwtStrategy');
require('./services/googleStrategy');
require('./services/googleAuthCodeStrategy');
app.use((0, _cors.default)({
  origin: `http://localhost:3000`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
const isProduction = process.env.NODE_ENV === 'production';

// DB Config
const dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

// Connect to Mongo
_mongoose.default.connect(dbConnection, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log('MongoDB Connected...');
}).catch(err => console.log(err));

// Use Routes
app.use('/', _routes.default);

// Serve images
// make /public/images folder if it doesnt exist
const IMAGES_FOLDER_PATH = '/public/images/';
const fs = require('fs');
if (!fs.existsSync((0, _path.join)(__dirname, '../public'))) {
  fs.mkdirSync((0, _path.join)(__dirname, '../public'));
}
if (!fs.existsSync((0, _path.join)(__dirname, '../public/images'))) {
  fs.mkdirSync((0, _path.join)(__dirname, '../public/images'));
}
app.use('/public/images', _express.default.static((0, _path.join)(__dirname, '../public/images')));

// Serve static assets if in production
if (isProduction) {
  // Set static folder
  app.use(_express.default.static((0, _path.join)(__dirname, '../../client/build')));
  app.get('*', (req, res) => {
    // index is in /server/src so 2 folders up
    res.sendFile((0, _path.resolve)(__dirname, '../..', 'client', 'build', 'index.html'));
  });
  const port = process.env.PORT || 80;
  app.listen(port, () => console.log(`Server started on port ${port}`));
} else {
  const port = process.env.PORT || 5000;
  const httpsOptions = {
    key: (0, _fs.readFileSync)((0, _path.resolve)(__dirname, '../security/cert.key')),
    cert: (0, _fs.readFileSync)((0, _path.resolve)(__dirname, '../security/cert.pem'))
  };
  const server = _https.default.createServer(httpsOptions, app).listen(port, () => {
    console.log('https server running at ' + port);
  });
}
//# sourceMappingURL=index.js.map