const mongoose = require('mongoose')

const aboutSchema = mongoose.Schema({
    about : {
        type: String
    },
    user : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
})

const About = mongoose.model('About',aboutSchema)
module.exports = About