const express = require('express');
const verifyToken = require('../middleware/auth');
const {upload, createPost, fetchPosts, addComment, likePost, unLikePost,fetchPostById } = require('../controllers/createPost');
const router = express.Router();

router.post('/create-post', verifyToken,upload, createPost);
router.get('/fetch-posts',fetchPosts)
router.get('/fetchbyId/:id',fetchPostById)
router.post('/comments',addComment)
router.post('/like',likePost)
router.post('/unlike',unLikePost)


module.exports = router;
