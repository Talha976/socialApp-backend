const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth.js');
const {aboutUser,fetchAbout,updateAbout} = require('../controllers/about.js');

router.post('/profile/about',verifyToken,aboutUser)
router.get('/profile/about',verifyToken,fetchAbout)
router.put('/profile/about',verifyToken,updateAbout)


module.exports = router