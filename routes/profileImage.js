const express = require('express');
const { uploadProfile, upload, fetchImage } = require('../controllers/profileImageController');
const verifyToken = require('../middleware/auth');


const router = express.Router();

router.post('/profile',verifyToken, upload, uploadProfile);
router.get('/profile',verifyToken,fetchImage)

module.exports = router;
