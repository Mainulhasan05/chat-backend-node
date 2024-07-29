const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const sequelize = require("./config/database");
const setupSocket = require("./socket");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(cors());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat-room", chatRoomRoutes);

setupSocket(io);

sequelize.sync({ alter: false }).then(() => {
  server.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});
