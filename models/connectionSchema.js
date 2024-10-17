const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['accepted'], default: 'accepted' },
});

module.exports = mongoose.model('Connection', ConnectionSchema);
