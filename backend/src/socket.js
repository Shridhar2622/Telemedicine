const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5175", "http://localhost:5174", "https://celebrated-semifreddo-915145.netlify.app", process.env.FRONTEND_URL].filter(Boolean),
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New Client Connected:", socket.id);

    // Join a room based on User ID
    socket.on("join_room", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    // Handle sending message (if we wanted to bypass API, but we use API + Emit)
    // We can also listen for 'typing' events here
    socket.on("typing", ({ roomId, isTyping }) => {
       socket.to(roomId).emit("display_typing", { isTyping });
    });

    socket.on("disconnect", () => {
      console.log("❌ Client Disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
