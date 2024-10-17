const express = require('express');
const verifyToken = require('../middleware/auth');
const { postExperience , fetchExperience, deleteExperience, updateExperience} = require('../controllers/experience');
const router = express.Router();

router.post('/experience', verifyToken,postExperience);
router.get('/experience',verifyToken,fetchExperience)
router.put('/experience/:id',verifyToken,updateExperience)
router.delete('/experience/:id',verifyToken,deleteExperience)

module.exports = router;
