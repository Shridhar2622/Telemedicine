const Message = require('../models/Message');
const User = require('../models/User');
const { getIO } = require('../socket');

// Send a message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id; // From middleware

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content
        });

        await newMessage.save();

        // Socket.io: Emit to receiver
        try {
            const io = getIO();
            io.to(receiverId).emit("receive_message", newMessage);
            // Also emit to sender (for multi-device sync or just confirming sent)
            // But frontend usually updates optimistically or via response.
        } catch (err) {
            console.error("Socket emit failed:", err.message);
        }

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};

// Get messages between current user and another user
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 }); // Oldest first for chat history

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Failed to fetch messages" });
    }
};

// Get list of conversations (latest message per user)
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }).sort({ createdAt: -1 });

        const uniqueUsers = new Map();

        messages.forEach(msg => {
            const otherUserId = msg.sender.toString() === currentUserId 
                ? msg.receiver.toString() 
                : msg.sender.toString();

            if (!uniqueUsers.has(otherUserId)) {
                uniqueUsers.set(otherUserId, {
                    userId: otherUserId,
                    lastMessage: msg.content,
                    timestamp: msg.createdAt,
                    read: msg.read || false // simple read status
                });
            }
        });

        // Fetch user details for these IDs
        const userIds = Array.from(uniqueUsers.keys());
        const users = await User.find({ _id: { $in: userIds } }, 'userName email role');

        const conversations = users.map(user => {
            const chatData = uniqueUsers.get(user._id.toString());
            return {
                ...user.toObject(),
                lastMessage: chatData.lastMessage,
                lastMessageTime: chatData.timestamp
            };
        }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        res.status(200).json({ success: true, data: conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ success: false, message: "Failed to fetch conversations" });
    }
};

module.exports = { sendMessage, getMessages, getConversations };
