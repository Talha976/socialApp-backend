const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    admin : {
        type: mongoose.Schema.ObjectId, ref:'Admin'
    },
    title: {
        type: String,
        required: true
    },
    vacancy: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    lastDate: {
        type: Date,
        required: true
    },
    jobType: {
        type: String,
        enum: ['on-site', 'hybrid', 'remote'],
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    file: {
        type: String, 
        required: false
    }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
