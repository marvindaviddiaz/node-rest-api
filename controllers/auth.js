const User = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = (req, resp, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422;
        error.data = errors.array();
        throw  error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User(email, hashedPw, name, true, false);
            return user.save();
        })
        .then(saved => {
            resp.status(201).json({message: 'User created!', email});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, resp, next) => {

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findById(email)
        .then(([rows], fieldData) => {
            if (!rows || rows.length === 0) {
                const error = new Error('User with this email could not be found');
                error.statusCode = 401;
                throw  error;
            }
            loadedUser = rows[0];
            return bcrypt.compare(password, loadedUser.password);
        })
        .then( isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw  error;
            }

            const token = jwt.sign({
                email: loadedUser.email,
                name: loadedUser.name
            }, 'secret', { expiresIn: '1h'});

            resp.status(200).json({token: token, userId: loadedUser.email})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
