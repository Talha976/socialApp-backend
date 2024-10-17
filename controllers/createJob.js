const express = require('express');
const multer = require('multer');
const path = require('path');
const Job = require('../models/createJob');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('file');

const postJob = async (req, res) => {
    try {
        const { title, vacancy, description, education, experience, specialization, lastDate, jobType, salary } = req.body;
        const adminID = req.adminID;
        const file = req.file ? req.file.path : null;
        const newJob = new Job({
            admin: adminID,
            title,
            vacancy,
            description,
            education,
            experience,
            specialization,
            lastDate,
            jobType,
            salary,
            file
        });
        if (!adminID) {
            res.status(404).json({ message: 'Token not found' });
        } else {
            await newJob.save();
            res.status(201).json({ message: 'Job created successfully' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error });
    }
};
const fetchJob = async (req, res) => {
    const adminID = req.adminID
    try {

        const findJobs = await Job.find({ admin: adminID });
        if (!findJobs) {
            return res.status(404).json({ message: 'No Job Found' })
        } else {
            return res.status(201).json(findJobs)
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const fetchById = async (req, res) => {

    try {
        const { id } = req.params
        const adminID = req.adminID
        const findJob = await Job.find({ _id: id, admin: adminID })
        if (!findJob) {
            console.log('')
            return res.status(404).json({ message: 'Record not found' })
        } else {
            return res.status(200).json({ job: findJob })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
const fetchAllJobs = async (req, res) => {
    try {
        const findJobs = await Job.find(); 
        if (findJobs.length === 0) {
            return res.status(200).json({ message: 'No jobs found', jobs: [] });
        }
        return res.status(200).json(findJobs);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const updateJob = async (req, res) => {
    const { id } = req.params;
    const adminID = req.adminID

    const { title, vacancy, description, education, experience, specialization, lastDate, jobType, salary, file } = req.body
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            { _id: id, admin: adminID },
            {
                title: title,
                vacancy: vacancy,
                description: description,
                education: education,
                experience: experience,
                specialization: specialization,
                lastDate: lastDate,
                jobType: jobType,
                salary: salary,
                file: file
            },
            { new: true });
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        return res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

const deleteJob = async (req, res) => {
    try {
        const { id } = req.params
        const adminID = req.adminID
        const delJob = await Job.findByIdAndDelete({ _id: id, admin: adminID })
        if (delJob) {
            return res.status(200).json({ message: 'Deleted' })
        } else {
            return res.status(400).json({ message: 'Error' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' })
    }
}

module.exports = { postJob, upload, fetchJob,fetchAllJobs, updateJob, fetchById, deleteJob }
