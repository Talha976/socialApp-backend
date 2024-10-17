const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const CreatePost = require('../models/createPost');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

const usersSocketMap = {};

const getReceivedSocketId = (receiverId) => {
  return usersSocketMap[receiverId];
};


io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  const userId = socket.handshake.query.userId;

  

  if (userId && userId !== 'undefined') {
    usersSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  io.emit('getConnectedUsers', Object.keys(usersSocketMap));

  
  socket.on('like post', async ({ postId, userId }) => {
    try {
      const post = await CreatePost.findById(postId).populate('user').populate('comments.user');
      if (post) {
        if (!post.likes.includes(userId)) {
          post.likes.push(userId);
        }
        await post.save();
        io.emit('post updated', post.likes);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  });
  
  socket.on('unlike post', async ({ postId, userId }) => {
    try {
      const post = await CreatePost.findById(postId).populate('user').populate('comments.user');
      if (post) {
        post.likes = post.likes.filter(like => like && like.equals(userId));
        await post.save();
        io.emit('post updated', post.comments);
      }
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  });

  
  socket.on('comment', async ({ postId, userId, comment }) => {
    try {
      const post = await CreatePost.findById(postId).populate('user').populate('comments.user');
      if (post) {
        post.comments.push({
          user: userId,
          comments: comment,
        });
        await post.save();
        io.emit('post updated', post);
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  });
  

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    if (userId) {
      delete usersSocketMap[userId];
      console.log(`User ${userId} removed from map`);
    }
    io.emit('getConnectedUsers', Object.keys(usersSocketMap));
  });
});


module.exports = { app, io, server, getReceivedSocketId };


