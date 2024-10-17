const express = require('express')
const verifyAdminToken = require('../middleware/adminAuth')
const { postJob ,upload, fetchJob,updateJob, fetchById, deleteJob, fetchAllJobs} = require('../controllers/createJob')
const router = express.Router()


router.post('/create-jobs',verifyAdminToken,upload,postJob)
router.get('/fetch-jobs',verifyAdminToken,fetchJob)
router.get('/fetch/:id',verifyAdminToken,fetchById)
router.get('/fetch-all-jobs',fetchAllJobs)
router.put('/update/:id', verifyAdminToken, updateJob);
router.delete('/delete-job/:id', verifyAdminToken, deleteJob);


module.exports = router