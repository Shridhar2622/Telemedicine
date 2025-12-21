import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Persist the socket instance across renders
    const socketRef = useRef(null);

    // Normalize the user ID
    const userId = user.id || user._id;

    useEffect(() => {
        if (userId && !socketRef.current) {
            const ENDPOINT = SOCKET_URL; 
            socketRef.current = io(ENDPOINT);



            socketRef.current.on("new_notification", (notification) => {
                setNotifications((prev) => [notification, ...prev]);
                setUnreadCount((prev) => prev + 1);
            });
            
            socketRef.current.on("connect_error", (err) => {
                console.error("Socket connection error:", err.message);
            });
            
            // Ensure the user joins their notification room on every connection
            socketRef.current.on("connect", () => {
                console.log("Socket connected successfully:", socketRef.current.id);
                socketRef.current.emit("join_room", userId);
            });

            setSocket(socketRef.current);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);

    const markAllAsRead = () => {
        setUnreadCount(0);
        setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, markAllAsRead, setNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};
