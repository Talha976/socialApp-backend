const Notification = require("../models/notifications");
const User = require("../models/userSchema");
const { io } = require("../socket/socket");


const sendNotification = async (req, res) => {
  try {
    const { recipientId, senderId, postId, action, message } = req.body;

    const recipient = await User.findById(recipientId);
    const sender = await User.findById(senderId);

    if (!recipient || !sender) {
      return res.status(404).json({ message: 'Recipient or sender not found.' });
    }

    const newNotification = new Notification({
      recipient: recipientId,
      sender: senderId,
      post: postId || null,
      action,
      message,
    });

    await newNotification.save();

    io.to(recipientId).emit('newNotification', newNotification);

    return res.status(201).json({
      message: 'Notification sent successfully.',
      notification: newNotification,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const fetchNotifications = async (req, res) => {
  const userId = req.userID; 

  try {
    
    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'firstName lastName profileImage') 
      .sort({ createdAt: -1 }); 

    if (notifications) {
      return res.status(200).json(notifications);
    } else {
      return res.status(404).json({ message: 'No notifications found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {sendNotification,fetchNotifications}