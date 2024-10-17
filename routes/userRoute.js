const express = require('express');
const router = express.Router();
const { register, login, updateUser, fetchUser, fetchAllUsers } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', verifyToken, updateUser);
router.get('/profile',verifyToken,fetchUser)
router.get('/all-users',verifyToken,fetchAllUsers)

module.exports = router;
