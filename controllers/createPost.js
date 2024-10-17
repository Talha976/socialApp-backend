const multer = require("multer");
const CreatePost = require("../models/createPost");
const path = require('path');
const User = require("../models/userSchema");
const Notification = require("../models/notifications");
const { getReceivedSocketId } = require("../socket/socket");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('file');

const createPost = async (req, res) => {
    const userID = req.userID;
    const { content } = req.body;
    const file = req.file ? req.file.path : '';
    try {
        const post = new CreatePost({ user: userID, content, image: file });

        const savePost = await post.save();
        if (savePost) {
            return res.status(200).json({ message: 'Posted Successfully' });
        } else {
            return res.status(400).json({ message: 'Some Error' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
};

const fetchPosts = async (req, res) => {
    try {
        const posts = await CreatePost.find()
            .populate({
                path: 'user',
                select: '_id firstName lastName profileImage'
            })
            .populate({
                path: 'comments.user',
                select: '_id firstName lastName profileImage'
            })
            .sort({ createdAt: -1 });
        if (posts) {
            return res.status(200).json(posts);
        } else {
            return res.status(400).json({ message: 'No Post Found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
};

const fetchPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const singlePost = await CreatePost.findById(postId).populate({
            path: 'user',
            select: '_id firstName lastName profileImage'
        })
        .populate({
            path: 'comments.user',
            select: '_id firstName lastName profileImage'
        });
        if (!singlePost) {
            return res.status(404).json({ message: 'Post not found' });
        } else {
            return res.status(200).json(singlePost);
        }
    } catch {
        return res.status(404).json({ message: 'Server Error' });
    }
};

const likePost = async (req, res) => {
    const { recipientId, postId, userId, action, message } = req.body;
    try {
        const post = await CreatePost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        await CreatePost.updateOne(
            { _id: postId },
            {
                $addToSet: {
                    likes: userId
                }
            }
        );

        if (post.user.toString() !== userId) {
            const newNotification = new Notification({
                recipient: recipientId,
                sender: userId,
                post: postId,
                action,
                message
            });

            const savedNotification = await newNotification.save();

            if (recipientId) {
                const notificationData = {
                    id: savedNotification._id,
                    message: savedNotification.message,
                    icon: action,
                    time: new Date(savedNotification.createdAt).toLocaleTimeString(),
                };
                io.to(recipientId).emit('newNotification', notificationData);
            }
        }

        return res.status(200).json({ message: 'Post liked' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const unLikePost = async (req, res) => {
    const { postId, userId } = req.body;
    try {
        const likedPost = await CreatePost.updateOne(
            { _id: postId },
            {
                $pull: {
                    likes: userId
                }
            }
        );

        if (likedPost.user.toString() === userId) {
            await CreatePost.updateOne(
                { _id: postId },
                {
                    $pull: {
                        likes: userId
                    }
                }
            );
        }

        if (likedPost.nModified) {
            return res.status(200).json({ message: 'Unliked' });
        } else {
            return res.status(404).json({ message: 'Error unliking' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const addComment = async (req, res) => {
    const { recipientId, postId, userId, comment, action, message } = req.body;
    try {
        const post = await CreatePost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await CreatePost.updateOne(
            { _id: postId },
            {
                $push: {
                    comments: {
                        user: userId,
                        comments: comment
                    }
                }
            }
        );

        if (post.user.toString() !== userId) {
            const newNotification = new Notification({
                recipient: recipientId,
                sender: userId,
                post: postId,
                action,
                message
            });

            const savedNotification = await newNotification.save();

            if (recipientId) {
                const notificationData = {
                    id: savedNotification._id,
                    message: savedNotification.message,
                    icon: action,
                    time: new Date(savedNotification.createdAt).toLocaleTimeString(),
                };
                io.to(recipientId).emit('newNotification', notificationData);
            }
        }

        return res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { upload, createPost, fetchPosts, addComment, likePost, unLikePost, fetchPostById };
