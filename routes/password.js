const express = require('express')
const { forgetPassword, resetPassword } = require('../controllers/password')
const router = express.Router()

router.post('/forgot-password',forgetPassword)
router.put('/reset-password/:id/:token',resetPassword)


module.exports = router