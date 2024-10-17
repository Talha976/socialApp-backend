const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth.js');
const { upload, uploadBgImage } = require('../controllers/bgImage.js');

router.put('/profile',verifyToken,upload,uploadBgImage)

module.exports = router