const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  school: {
    type: String,
  },
  degree: {
    type: String,
  },
  fieldOfStudy: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  grade: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;
