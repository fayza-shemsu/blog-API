const User = require("../models/User");
const Post = require("../models/post");
const Comment = require("../models/comment");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role)
      return res
        .status(400)
        .json({ success: false, message: "Role is required" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.role = role;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User role updated", data: user });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    
    await Post.deleteMany({ author: user._id });
    await Comment.deleteMany({ author: user._id });

    await user.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "User and their content deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};
