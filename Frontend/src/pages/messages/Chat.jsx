import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../../layouts/MainLayout';
import api from '../../utils/api';
import useFetchData from '../../hooks/useFetchData';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext'; // Import context
import PrescriptionModal from '../../components/PrescriptionModal';

const Chat = () => {
    const { data: conversationData, loading: loadingConversations, refetch: refetchConversations } = useFetchData('/messages/conversations');
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Access the global socket connection
    const { socket } = useSocket();

    // Set up real-time message listeners
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            // Only add message to state if it belongs to the active chat
            if (selectedUser && (message.sender === selectedUser._id || message.receiver === selectedUser._id)) {
                 setMessages((prev) => [...prev, message]);
            }
            refetchConversations();
        };

        socket.on("receive_message", handleNewMessage);

        return () => {
            socket.off("receive_message", handleNewMessage);
        };

    }, [socket, selectedUser]); // Re-bind when socket or selectedUser changes

    // Handle navigation from "Find Doctor" or other pages
    useEffect(() => {
        if (location.state?.userId) {
            // If passed via navigation state
            const targetUser = {
                _id: location.state.userId,
                userName: location.state.userName,
                role: location.state.role
            };
            handleSelectUser(targetUser);
        }
    }, [location.state]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setLoadingMessages(true);
        try {
            // 1. Fetch messages
            const res = await api.get(`/messages/${user._id}`);
            setMessages(res.data.data);

            // 2. Mark as read if there are unread messages
            if (user.unreadCount > 0) {
                await api.put(`/messages/read/${user._id}`);
                // Update local state to reflect read status
                refetchConversations();
                // Trigger global badge update
                window.dispatchEvent(new Event('update-unread-badge'));
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await api.post('/messages/send', {
                receiverId: selectedUser._id,
                content: newMessage
            });
            
            // We append our own message immediately (optimistic UI)
            setMessages([...messages, res.data.data]);
            setNewMessage('');
            refetchConversations(); 
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };


    const conversations = conversationData?.data || [];
    
    // Temporarily display the selected user in the sidebar if it's a new conversation
    const displayConversations = [...conversations];
    if (selectedUser && !conversations.find(c => c._id === selectedUser._id)) {
        displayConversations.unshift(selectedUser);
    }

    return (
        <MainLayout>
            <div className="h-[calc(100vh-140px)] flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-slide-up">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50">
                    <div className="p-4 border-b border-slate-100 bg-white">
                        <h2 className="text-lg font-bold text-slate-800">Messages</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {loadingConversations ? (
                            <div className="p-4 space-y-3">
                                {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse"></div>)}
                            </div>
                        ) : displayConversations.length > 0 ? (
                            displayConversations.map(user => (
                                <div 
                                    key={user._id}
                                    onClick={() => handleSelectUser(user)}
                                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition-colors flex items-center gap-3 ${selectedUser?._id === user._id ? 'bg-white border-l-4 border-l-primary shadow-sm' : ''}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {user.userName?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-semibold text-slate-800 truncate text-sm">{user.userName}</h3>
                                            {user.lastMessageTime && (
                                                <span className="text-xs text-slate-400">{new Date(user.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center gap-2">
                                            <p className={`text-sm truncate flex-1 ${user.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                                                {user.lastMessage || 'Start a conversation'}
                                            </p>
                                            {user.unreadCount > 0 && (
                                                <div className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                    {user.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <p>No conversations yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedUser ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3 shadow-sm z-10">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                    {selectedUser.userName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedUser.userName}</h3>
                                    <span className="text-xs text-slate-500 capitalize">{selectedUser.role}</span>
                                </div>
                                <div className="ml-auto">
                                    {currentUser.role === 'Doctor' && selectedUser.role === 'Patient' && (
                                        <button 
                                            onClick={() => setIsPrescriptionModalOpen(true)}
                                            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm border border-emerald-200"
                                            title="Write Prescription"
                                        >
                                            <span className="text-lg">💊</span>
                                            Write Rx
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                {loadingMessages ? (
                                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                                ) : messages.length > 0 ? (
                                    messages.map((msg, idx) => {
                                        const isMyMessage = msg.sender === currentUser._id || msg.sender === currentUser.id; // Check both for safety
                                        return (
                                            <div key={idx} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                                                    isMyMessage 
                                                        ? 'bg-primary text-white rounded-tr-none' 
                                                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                                }`}>
                                                    <div className="text-sm break-words">
                                                        {msg.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) => (
                                                            part.match(/https?:\/\/[^\s]+/) ? (
                                                                <a 
                                                                    key={i} 
                                                                    href={part} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className={`underline hover:opacity-80 ${isMyMessage ? 'text-blue-100' : 'text-primary'}`}
                                                                >
                                                                    {part}
                                                                </a>
                                                            ) : part
                                                        ))}
                                                    </div>
                                                    <p className={`text-[10px] mt-1 text-right ${isMyMessage ? 'text-blue-100' : 'text-slate-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 text-slate-400">
                                        <p>No messages yet. Say hello! 👋</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-primary border rounded-xl outline-none transition-all"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="bg-primary text-white p-3 rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-4xl">💬</div>
                            <h3 className="text-xl font-bold text-slate-600">Select a conversation</h3>
                             <p>Choose a contact from the sidebar to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>

            
            <PrescriptionModal 
                isOpen={isPrescriptionModalOpen} 
                onClose={() => setIsPrescriptionModalOpen(false)}
                patientId={selectedUser?._id}
                patientName={selectedUser?.userName}
            />
        </MainLayout>
    );
};

export default Chat;
