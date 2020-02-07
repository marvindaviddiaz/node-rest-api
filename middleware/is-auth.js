const jwt = require('jsonwebtoken');

module.exports = (req, resp, next) => {
    const authheader = req.get('Authorization');
    if (!authheader) {
        const error = new Error('not authenticated');
        error.statuscode = 401;
        throw error;
    }
    const token = authheader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        err.statuscode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('not authenticated');
        error.statuscode = 401;
        throw error;
    }
    req.userId = decodedToken.email;
    next();
};
