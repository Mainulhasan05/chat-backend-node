const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const sequelize = require("./config/database");
const setupSocket = require("./socket");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

setupSocket(io);

sequelize.sync({ alter: false }).then(() => {
  server.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});
