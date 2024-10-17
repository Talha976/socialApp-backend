const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema)
module.exports = ConnectionRequest;
