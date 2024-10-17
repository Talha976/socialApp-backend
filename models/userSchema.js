const mongoose = require('mongoose');
const ProfileImage = require('./userImage');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    additionalName: {
        type: String
    },
    headline: {
        type: String
    },
    position: {
        type: String
    },
    industry: {
        type: String
    },
    schoolName: {
        type: String
    },
    country:{
        type: String
    },
    city:{
        type:String
    },
    website:{
        type: String
    },
    profileImage : {
        type: String
    }
},{timestamps:true})

const User = mongoose.model('User', userSchema)

module.exports = User 