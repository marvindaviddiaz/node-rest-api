const { validationResult } = require('express-validator');
const uuid = require('uuid/v4');
const Post = require('../models/post');
const PostDTO = require('../models/postDTO');
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, resp, next) => {
    console.log('Getting posts');
    Post.find()
        .then(([rows], fieldData) => {
            let data = rows.map(m => new PostDTO(m));
            console.log(data);
            resp.status(200).json({message: "Fetched Posts", posts: data});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getPost = (req, resp, next) => {
    const postId = req.params.postId;
    console.log('Getting post ' + postId);
    Post.findById(postId)
        .then(([rows], fieldData) => {
            if (!rows || rows.length === 0) {
                const error = new Error('Post Not Found');
                error.statusCode = 422;
                throw error;
            }
            console.log(rows[0]);
            resp.status(200).json({message: "Post fetched", post: new PostDTO(rows[0])});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = (req, resp, next) => {
    // VALIDATE
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    const id = uuid();
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path;

    let post = new Post(id, title, content, imageUrl, 'Marvin Díaz', new Date());

    post.save()
        .then(() => {
            resp.status(201).json({ message: "Post created successfully", post: new PostDTO(post)});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updatePost = (req, resp, next) => {
    const postId = req.params.postId;
    console.log('Updating post ' + postId);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path;
    }
    if(!imageUrl) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    let post;
    Post.findById(postId)
        .then(([rows], fieldData) => {
            if (!rows || rows.length === 0) {
                const error = new Error('Post Not Found');
                error.statusCode = 422;
                throw error;
            }

            post = new Post(rows[0].id, rows[0].title, rows[0].content, rows[0].imageUrl, rows[0].creatorName, rows[0].createdAt);

            // post from BD

            // validar si cambio la imagen
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;

            return post.update(); // se usa el siguiente then superior (de abajo)

        })
        .then( () => {
            resp.status(200).json({ message: "Post updated", post: new PostDTO(post)});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deletePost = (req, resp, next) => {
    const postId = req.params.postId;
    console.log('Deleting post ' + postId);

    let post;
    Post.findById(postId)
        .then(([rows], fieldData) => {
            if (!rows || rows.length === 0) {
                const error = new Error('Post Not Found');
                error.statusCode = 422;
                throw error;
            }

            post = new Post(rows[0].id, rows[0].title, rows[0].content, rows[0].imageUrl, rows[0].creatorName, rows[0].createdAt);

            clearImage(post.imageUrl);

            return post.delete(); // se usa el siguiente then superior (de abajo)
        })
        .then( () => {
            resp.status(200).json({ message: "Post deleted"});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {console.log(err)});
};
