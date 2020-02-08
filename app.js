const express = require('express');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

const app = express();


// security headers
app.use(helmet());
// logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

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
app.use('/auth', authRoutes);

// error handling (received exceptions by throw)
app.use((err, req, resp, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  resp.status(status).json({message: message, data: data})
});

let server = app.listen(process.env.PORT || 8080);
const io = require('./socket').init(server);
io.on('connection', socket => {
   console.log('Client connected');
});

