const ConnectionRequest = require("../models/connectionRequest")

const sendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;
    
    try {
        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            receiver: receiverId,
        });

        if (existingRequest) {
            return res.status(200).json({ message: 'Request already sent' });
        }

        const request = new ConnectionRequest({ sender: senderId, receiver: receiverId });
        const savedRequest = await request.save();

        if (savedRequest) {
            io.emit('new-request', { request: savedRequest });
            return res.status(201).json({ message: 'Request Sent' });
        } else {
            return res.status(401).json({ message: 'Failed to send request' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send request', error: error.message });
    }
};

const getRequests = async(req,res)=>{
    const userID = req.userID
    try {
        const request = await ConnectionRequest.find({receiver: userID})
        .populate('sender', 'firstName lastName profileImage').where('status').equals('pending')
        if(request){
            return res.status(200).json(request)
        } 
    } catch (error) {
        return res.status(500).json({message: 'Server Error'})
    }
}

const acceptRequest = async (req, res) => {
    const { requestId } = req.body;
    const userId = req.userID; 
    try {
        const request = await ConnectionRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.receiver.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to accept this request' });
        }

        request.status = 'accepted';
        await request.save();

        io.emit('request-accepted', { request });

        return res.status(200).json({ message: 'Request Accepted' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const rejectRequest = async(req,res)=>{
    const {requestId} = req.body
    try {
        const request = await ConnectionRequest.findById(requestId)
        if(request){
            await request.remove()
            io.emit('request-rejected',{request: request})
            return res.status(200).json({message: 'Request Rejected'})
        }
        else{
            return res.status(404).json({message: 'Request not found'})
        }
    } catch (error) {
        return res.status(500).json({message: 'Server Error'})
    }
}

const connections = async(req,res)=>{
    const userID = req.userID
    try {
        const connections = await ConnectionRequest.find({$or: [{sender: userID}, {receiver: userID}]})
       .populate('sender', 'firstName lastName profileImage')
       .populate('receiver', 'firstName lastName profileImage')
       .where('status').equals('accepted')
        if(connections){
            return res.status(200).json(connections)
        }
    } catch (error) {
        return res.status(500).json({message: 'Server Error'})
    }
}

module.exports = {sendRequest,acceptRequest,rejectRequest,getRequests,connections}