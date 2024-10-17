const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    cv: { type: String, required: true },  
    dateApplied: { type: Date, default: Date.now },
})
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;

