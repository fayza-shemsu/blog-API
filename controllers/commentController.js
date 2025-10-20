const Comment = require("../models/comment");
const Post = require("../models/post");


const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content)
      return res.status(400).json({ message: "Content is required" });

    
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });


    if (comment.author.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    comment.content = req.body.content || comment.content;
    const updated = await comment.save();

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    
    if (comment.author.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    await comment.deleteOne();
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
