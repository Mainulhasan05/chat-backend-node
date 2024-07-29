const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const ChatRoom = require("./models/chatRoomModel");

const setupSocket = (io) => {
  let activeUsers = {};

  io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    socket.on("joinRoom", async ({ token, roomId }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
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

        if (!activeUsers[roomId].includes(user.id)) {
          activeUsers[roomId].push(user.id);
        }

        io.to(roomId).emit("activeUsers", activeUsers[roomId]);

        console.log(`User ${user.username} joined room ${roomId}`);
      } catch (error) {
        socket.emit("error", "Authentication failed.");
      }
    });

    socket.on("leaveRoom", async ({ token, roomId }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(decoded.id);

        if (!user) {
          socket.emit("error", "Invalid user.");
          return;
        }

        socket.leave(roomId);

        if (activeUsers[roomId]) {
          activeUsers[roomId] = activeUsers[roomId].filter(
            (id) => id !== user.id
          );

          if (activeUsers[roomId].length === 0) {
            delete activeUsers[roomId];
          } else {
            io.to(roomId).emit("activeUsers", activeUsers[roomId]);
          }
        }

        console.log(`User ${user.username} left room ${roomId}`);
      } catch (error) {
        socket.emit("error", "Authentication failed.");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
      for (const roomId in activeUsers) {
        activeUsers[roomId] = activeUsers[roomId].filter(
          (id) => id !== socket.id
        );

        if (activeUsers[roomId].length === 0) {
          delete activeUsers[roomId];
        } else {
          io.to(roomId).emit("activeUsers", activeUsers[roomId]);
        }
      }
    });

    socket.on("new_message", async ({ token, roomId, message }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(decoded.id);

        if (!user) {
          socket.emit("error", "Invalid user.");
          return;
        }

        io.to(roomId).emit("new_message", { user: user.username, message });
      } catch (error) {
        socket.emit("error", "Authentication failed.");
      }
    });

    socket.on("typing", async ({ token, roomId }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(decoded.id);

        if (!user) {
          socket.emit("error", "Invalid user.");
          return;
        }

        socket.to(roomId).emit("typing", user.username);
      } catch (error) {
        socket.emit("error", "Authentication failed.");
      }
    });
  });
};

module.exports = setupSocket;
