const express = require('express')
const { applyForJob ,upload, fetchJobApplications} = require('../controllers/jobApplication')
const verifyToken = require('../middleware/auth')
const router = express.Router()

router.post('/apply-job',verifyToken, upload, applyForJob)
router.get('/appllicants',fetchJobApplications)


module.exports = router

