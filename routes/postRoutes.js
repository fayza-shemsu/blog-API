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

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const Post = require("../models/post"); 


router.get("/", getPosts); 
router.get("/:id", getPostById); 


router.post("/", protect, createPost); 
router.put("/:id", protect, updatePost); 
router.delete("/:id", protect, deletePost); 
router.put("/:id/like", protect, toggleLike); 


router.delete("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    await post.deleteOne();
    res.status(200).json({ success: true, message: "Post deleted by admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve all blog posts (optional filter by category or tag)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         author:
 *           type: string
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

