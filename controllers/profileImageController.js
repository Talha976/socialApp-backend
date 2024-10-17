const multer = require('multer');
const path = require('path');
const ProfileImage = require('../models/userImage');
const User = require('../models/userSchema');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('profile-image');

const uploadProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        const userID = req.userID;
        const profileImagePath = req.file ? req.file.path : '';
        const savedProfile = await User.updateOne({_id:userID},{ $set: { profileImage: profileImagePath } });
        if (savedProfile) {
            return res.status(201).json({ message: 'Image Uploaded Successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to save profile image' });
        }
    } catch (error) {
        console.error('Error in uploadProfile:', error);
        return res.status(500).json({ message: 'Failed to save image', error: error.message });
    }
};


const fetchImage = async (req, res) => {
    try {
        const userID = req.userID;
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const profileImage = await ProfileImage.findOne({ user: userID });
        
        if (!profileImage) {
            return res.status(404).json({ message: 'Profile image not found' });
        }
        return res.status(200).json({ profileImage: profileImage });
    } catch (error) {
        console.error('Error in fetchImage:', error);
        res.status(500).json({ message: 'Failed to fetch image', error: error.message });
    }
};



module.exports = { upload, uploadProfile, fetchImage };
