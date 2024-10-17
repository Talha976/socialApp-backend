const multer = require('multer');
const path = require('path');
const JobApplication = require('../models/jobApplication');

// Setup storage and file filter
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('CV must be in PDF format'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
}).single('file');

const applyForJob = async (req, res) => {
    try {
        const { firstname, lastname, email, contact, jobId } = req.body;
        const file = req.file ? req.file.path : null;

        if (!file) {
            return res.status(400).json({ message: 'CV is required' });
        }

        const existingApplication = await JobApplication.findOne({ jobId, email });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const newApplication = new JobApplication({
            jobId,
            firstname,
            lastname,
            email,
            contact,
            cv: file,
        });

        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const fetchJobApplications = async (req, res) => {
    try {
        const fetchJobs = await JobApplication.find()
        .populate('jobId', 'title') 
        .exec();
        if (fetchJobs.length > 0) {
            return res.status(200).json(fetchJobs);
        } else {
            return res.status(404).json({ message: 'No Applicants Found' });
        }
    } catch (error) {
        console.error('Error fetching job applications:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { applyForJob, upload, fetchJobApplications };
