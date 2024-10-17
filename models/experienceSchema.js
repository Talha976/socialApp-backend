const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'self', 'contract', 'freelance', 'internship', 'apprenticeship', 'seasonal'],
        required: true
    },
    location: {
        type: String,
        enum: ['on-site', 'hybrid', 'remote'],
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
