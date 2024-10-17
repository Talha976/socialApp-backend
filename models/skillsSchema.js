const mongoose = require('mongoose')

const skillsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    skill: { type: String, required: true },
    logo : {
        type: String
    }
  });
  

const Skill = mongoose.model('Skill', skillsSchema)
module.exports = Skill