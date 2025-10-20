const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:postId", protect, createComment);
router.get("/:postId", getCommentsByPost);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);

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
