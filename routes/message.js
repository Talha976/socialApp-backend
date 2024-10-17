const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/message.js'); 
const verifyToken = require('../middleware/auth'); 

router.post('/send/:id', verifyToken, sendMessage);
router.get('/messages/:id', verifyToken, getMessages);

module.exports = router; 