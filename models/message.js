const { default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.ObjectId, ref: 'User',
        required: true
    },
    receiverID: {
        type: mongoose.Schema.ObjectId, ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Message = mongoose.model('Message',messageSchema)

module.exports = Message