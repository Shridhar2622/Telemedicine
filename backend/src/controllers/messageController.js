const Message = require('../models/Message');
const User = require('../models/User');
const { getIO } = require('../socket');

// Handle sending a new message and notifying the receiver
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

        // Real-time delivery: send to receiver via Socket.io
        try {
            const io = getIO();
            io.to(receiverId).emit("receive_message", newMessage);
            
            // Also trigger a notification toast for the user
            io.to(receiverId).emit("new_notification", {
                type: "message",
                message: `New message from ${req.user.userName || "User"}`, 
                data: newMessage,
                senderId: req.user.id,
                senderName: req.user.userName,
                isRead: false,
                createdAt: new Date()
            });

        } catch (err) {
            console.error("Socket emit failed:", err.message);
        }

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};

// Fetch chat history between two users
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

// Mark all messages from this sender as read
const markMessagesRead = async (req, res) => {
    try {
        const { senderId } = req.params;
        const currentUserId = req.user.id;

        await Message.updateMany(
            { sender: senderId, receiver: currentUserId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Retrieve the list of active conversations with latest message previews
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }).sort({ createdAt: -1 });

        const uniqueUsers = new Map();

        for (const msg of messages) {
            const otherUserId = msg.sender.toString() === currentUserId 
                ? msg.receiver.toString() 
                : msg.sender.toString();

            if (!uniqueUsers.has(otherUserId)) {
                // Calculate how many unread messages are from this user
                const unreadCount = await Message.countDocuments({
                    sender: otherUserId,
                    receiver: currentUserId,
                    read: false
                });

                uniqueUsers.set(otherUserId, {
                    userId: otherUserId,
                    lastMessage: msg.content,
                    timestamp: msg.createdAt,
                    unreadCount: unreadCount,
                    read: msg.read
                });
            }
        }

        // Fetch user details for these IDs
        const userIds = Array.from(uniqueUsers.keys());
        const users = await User.find({ _id: { $in: userIds } }, 'userName email role');

        const conversations = users.map(user => {
            const chatData = uniqueUsers.get(user._id.toString());
            return {
                ...user.toObject(),
                lastMessage: chatData.lastMessage,
                lastMessageTime: chatData.timestamp,
                unreadCount: chatData.unreadCount
            };
        }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        res.status(200).json({ success: true, data: conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ success: false, message: "Failed to fetch conversations" });
    }
};

module.exports = { sendMessage, getMessages, getConversations, markMessagesRead };
