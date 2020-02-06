const express = require('express');
const feedRoutes = require('./routes/feed');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, resp, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// CORS
app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded
app.use(bodyParser.json()); // application/json
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/feed', feedRoutes);

// error handling (received exceptions by throw)
app.use((err, req, resp, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  resp.status(status).json({message: message})
});

app.listen(8080);
