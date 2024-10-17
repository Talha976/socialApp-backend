const express = require('express');
const { addEducation, getEducationByUserId, updateEducation, deleteEducation } = require('../controllers/education');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/education', verifyToken,addEducation);
router.get('/education',verifyToken, getEducationByUserId);
router.put('/education/:id',verifyToken, updateEducation);
router.delete('/education/:id',verifyToken, deleteEducation);

module.exports = router;
