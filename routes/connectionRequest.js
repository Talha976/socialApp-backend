const express = require('express');
const verifyToken = require('../middleware/auth');
const { sendRequest, acceptRequest, rejectRequest, getRequests, connections } = require('../controllers/connectionRequest');
const router = express.Router()

router.post('/send-request',verifyToken,sendRequest) 
router.post('/accept-request',verifyToken,acceptRequest) 
router.post('/reject-request',verifyToken,rejectRequest) 
router.get('/get-requests',verifyToken,getRequests)
router.get('/get-connections',verifyToken,connections)

module.exports = router;