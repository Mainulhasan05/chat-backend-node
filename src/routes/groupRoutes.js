// routes/groupRoutes.js
const express = require("express");
const {
  createGroup,
  joinGroup,
  leaveGroup,
  getGroups,
} = require("../controllers/groupController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createGroup);
router.post("/:groupId/join", protect, joinGroup);
router.post("/:groupId/leave", protect, leaveGroup);
router.get("/", protect, getGroups);

module.exports = router;
