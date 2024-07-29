const express = require("express");
const { getAllUsers, getProfile } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authenticate, getAllUsers);
router.get("/profile", authenticate, getProfile);

module.exports = router;
