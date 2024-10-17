const Conversation = require("../models/conversations")
const Message = require("../models/message");
const { getReceivedSocketId, io } = require("../socket/socket");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverID } = req.params;
    const senderID = req.userID;

    
    let conversation = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderID, receiverID]
      });
    }

    const newMessage = new Message({
      senderID,
      receiverID,
      message
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await Promise.all([conversation.save(),newMessage.save()])


      const receiverSocketId = getReceivedSocketId(receiverID);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', newMessage);
      }

      return res.status(200).json(newMessage);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const getMessages = async (req, res) => {
    const { id: userToChatId } = req.params;
    const senderID = req.userID;
  
    try {
      const conversation = await Conversation.findOne({
        participants: { $all: [senderID, userToChatId] }
      }).populate('messages');
  
      if (!conversation) {
        return res.status(200).json([]);
      }
  
      const messages = conversation.messages;
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  };
  

module.exports = {sendMessage,getMessages}