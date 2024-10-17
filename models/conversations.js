const { default: mongoose } = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.ObjectId, ref: 'User',
            required: true
        }
    ],
    messages: [{
        type: mongoose.Schema.ObjectId, ref: 'Message',
        required: true,
        default : []
    }]
}, { timestamps: true })

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = Conversation