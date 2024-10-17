const mongoose = require('mongoose')

const bgImageSchema = mongoose.Schema({
    bgImage : {
        type: String
    },
    user : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
})

const BackgroundImage = mongoose.model('BackgroundImage',bgImageSchema)
module.exports = BackgroundImage