const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth.js');
const { sendNotification, fetchNotifications } = require('../controllers/notification.js');

router.post('/send-notification',verifyToken,sendNotification)
router.get('/notifications',verifyToken,fetchNotifications)



module.exports = router