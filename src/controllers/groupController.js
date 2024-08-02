// controllers/groupController.js
const Group = require("../models/groupModel");
const GroupMember = require("../models/groupMemberModel");
const sendResponse = require("../utils/sendResponse");

exports.createGroup = async (req, res) => {
  const { name, avatar } = req.body;
  const { id: userId } = req.user;
  //   use date.now() to generate a unique group id
  const room_id = `group_${Date.now()}`;

  try {
    const group = await Group.create({
      name,
      avatar,
      room_id,
      created_by: userId,
    });

    // Add creator as a member
    await GroupMember.create({
      user_id: userId,
      group_id: group.id,
      role: "admin",
    });

    return sendResponse(res, 201, true, "Group created successfully", group);
  } catch (error) {
    return sendResponse(res, 500, false, "Internal server error", null);
  }
};

exports.joinGroup = async (req, res) => {
  const { groupId } = req.params;
  const { id: userId } = req.user;

  try {
    const membership = await GroupMember.create({
      user_id: userId,
      group_id: groupId,
      role: "member",
    });

    return sendResponse(
      res,
      200,
      true,
      "Joined group successfully",
      membership
    );
  } catch (error) {
    return sendResponse(res, 500, false, "Internal server error", null);
  }
};

exports.leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const { id: userId } = req.user;

  try {
    await GroupMember.destroy({
      where: {
        user_id: userId,
        group_id: groupId,
      },
    });

    return sendResponse(res, 200, true, "Left group successfully", null);
  } catch (error) {
    return sendResponse(res, 500, false, "Internal server error", null);
  }
};

exports.getGroups = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const groups = await GroupMember.findAll({
      where: { user_id: userId },
      include: Group,
    });

    return sendResponse(
      res,
      200,
      true,
      "Groups retrieved successfully",
      groups
    );
  } catch (error) {
    return sendResponse(res, 500, false, "Internal server error", null);
  }
};
