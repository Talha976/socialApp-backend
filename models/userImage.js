const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
    profileImage : {
        type: String
    },
    user : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
})

const ProfileImage = mongoose.model('ProfileImage',imageSchema)
module.exports = ProfileImage