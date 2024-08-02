const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

const setupSocket = (io) => {
  let activeUsers = {};

  io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    socket.on("join-room", (data) => {
      socket.join("rifat");
      console.log(socket.id, "joined room rifat");
    });
    socket.on("send", (data) => {
      io.to("rifat").emit("receive", data);
    });

    socket.on("event-name", (data) => {
      console.log(data);
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

    socket.on(
      "new_message",
      async ({ token, roomId, username, content, User, userId, createdAt }) => {
        try {
          io.to(roomId).emit("new_message", {
            username,
            userId,
            User,
            content,
            createdAt,
          });
        } catch (error) {
          socket.emit("error", "Authentication failed.");
        }
      }
    );

    socket.on("typing", async ({ username, token, roomId }) => {
      try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // const user = await User.findByPk(decoded.id);
        // if (!user) {
        //   socket.emit("error", "Invalid user.");
        //   return;
        // }

        socket.to(roomId).emit("typing", `${username} is typing...`);
      } catch (error) {
        socket.emit("error", "Authentication failed.");
      }
    });
  });
};

module.exports = setupSocket;
