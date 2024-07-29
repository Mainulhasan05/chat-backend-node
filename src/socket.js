const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const ChatRoom = require("./models/chatRoomModel");

const setupSocket = (io) => {
  let activeUsers = {};

  io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    // Handle user joining a room
    socket.on("joinRoom", async ({ token, roomId }) => {
      try {
        const decoded = jwt.verify(token, "your_jwt_secret_key");
        const user = await User.findByPk(decoded.id);
        const chatRoom = await ChatRoom.findByPk(roomId);

        if (!user || !chatRoom) {
          socket.emit("error", "Invalid user or room.");
          return;
        }

        socket.join(roomId);
        if (!activeUsers[roomId]) {
          activeUsers[roomId] = [];
        }
        activeUsers[roomId].push(user.id);
        io.to(roomId).emit("activeUsers", activeUsers[roomId]);

        console.log(`User ${user.username} joined room ${roomId}`);
      } catch (error) {
        socket.emit("error", "Authentication failed.");
      }
    });

    // Handle user leaving a room
    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);
      activeUsers[roomId] = activeUsers[roomId].filter(
        (id) => id !== socket.id
      );
      io.to(roomId).emit("activeUsers", activeUsers[roomId]);

      console.log(`User ${socket.id} left room ${roomId}`);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
      for (const roomId in activeUsers) {
        activeUsers[roomId] = activeUsers[roomId].filter(
          (id) => id !== socket.id
        );
        io.to(roomId).emit("activeUsers", activeUsers[roomId]);
      }
    });

    // Handle new message
    socket.on("new_message", ({ roomId, message }) => {
      io.to(roomId).emit("new_message", message);
    });

    // Handle typing
    socket.on("typing", ({ roomId, username }) => {
      socket.to(roomId).emit("typing", username);
    });
  });
};

module.exports = setupSocket;
