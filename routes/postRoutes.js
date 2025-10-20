const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
} = require("../controllers/postController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getPosts); // Get all posts
router.get("/:id", getPostById); // Get single post

// Protected routes
router.post("/", protect, createPost); // Create post
router.put("/:id", protect, updatePost); // Update post (author only)
router.delete("/:id", protect, deletePost); // Delete post (author/admin)
router.put("/:id/like", protect, toggleLike); // Like/unlike post

// Optional Admin-only route example
// router.delete("/all/:id", protect, adminOnly, deletePost);

module.exports = router;
