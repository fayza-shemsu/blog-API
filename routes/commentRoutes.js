const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

// CRUD for comments
router.post("/:postId", protect, createComment);
router.get("/:postId", getCommentsByPost);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
