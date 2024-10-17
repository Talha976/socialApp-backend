const express = require('express')
const router = express.Router()
const { adminLogin, adminRegister, adminLogout } = require('../controllers/admin.js');

router.post('/admin-login',adminLogin)
router.post('/admin-register',adminRegister)
router.post('/admin-logout',adminLogout)

module.exports = router

