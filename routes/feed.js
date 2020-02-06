const express = require('express');
const {body } = require('express-validator');
const feedController = require('../controllers/feeds');

const router = express.Router();

router.get('/post', feedController.getPosts);

router.get('/post/:postId', feedController.getPost);

router.delete('/post/:postId', feedController.deletePost);

router.post('/post', [ // array of middlewares (In this case validators)
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
], feedController.createPost);

router.put('/post/:postId', [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
], feedController.updatePost);


module.exports = router;
