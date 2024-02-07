import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import https from 'https';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import passport from 'passport';
import routes from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());
require('./services/jwtStrategy');
require('./services/googleStrategy');
require('./services/googleAuthCodeStrategy');

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.use(
    cors({
      origin: `http://localhost:3000`,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  );
}

// DB Config
const dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

// Connect to Mongo
mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch((err) => console.log(err));

// Use Routes
app.use('/', routes);

// Serve images
// make /public/images folder if it doesnt exist
const IMAGES_FOLDER_PATH = '/public/images/';
const fs = require('fs');
if (!fs.existsSync(join(__dirname, '../public'))) {
  fs.mkdirSync(join(__dirname, '../public'));
}
if (!fs.existsSync(join(__dirname, '../public/images'))) {
  fs.mkdirSync(join(__dirname, '../public/images'));
}
app.use('/public/images', express.static(join(__dirname, '../public/images')));

// Serve static assets if in production
if (isProduction) {
  // Set static folder
  app.use(express.static(join(__dirname, '../../client/build')));
  app.get('*', (req, res) => {
    // index is in /server/src so 2 folders up
    res.sendFile(resolve(__dirname, '../..', 'client', 'build', 'index.html'));
  });

  const port = process.env.PORT || 80;
  app.listen(port, () => console.log(`Server started on port ${port}`));
} else {
  const port = process.env.PORT || 5000;

  const httpsOptions = {
    key: readFileSync(resolve(__dirname, '../security/cert.key')),
    cert: readFileSync(resolve(__dirname, '../security/cert.pem')),
  };

  const server = https.createServer(httpsOptions, app).listen(port, () => {
    console.log('https server running at ' + port);
  });
}
