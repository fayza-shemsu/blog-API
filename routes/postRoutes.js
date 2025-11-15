const express = require("express");
const router = express.Router();
const multer = require("multer"); 


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


const storage = multer.diskStorage({});
const upload = multer({ storage });

// ================= ROUTES =================

// Get all posts
router.get("/", getPosts);

// Get single post
router.get("/:id", getPostById);

// ✅ Create post with optional image upload
router.post("/", protect, upload.single("image"), createPost);

// ✅ Update post with image upload (Cloudinary)
router.put("/:id", protect, upload.single("image"), updatePost);


// Update post
router.put("/:id", protect, updatePost);

// Delete post (author or admin)
router.delete("/:id", protect, deletePost);

// Like/unlike post
router.put("/:id/like", protect, toggleLike);

// Admin delete post
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
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fayza Shemsu
 *               email:
 *                 type: string
 *                 example: fayza@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation or user exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
