const express = require('express');
const {body } = require('express-validator');
const feedController = require('../controllers/feeds');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/post', isAuth, feedController.getPosts);

router.get('/post/:postId', isAuth, feedController.getPost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

router.post('/post', isAuth, [ // array of middlewares (In this case validators)
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
], feedController.createPost);

router.put('/post/:postId', isAuth, [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
], feedController.updatePost);


module.exports = router;
