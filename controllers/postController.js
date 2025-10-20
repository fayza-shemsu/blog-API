const Post = require("../models/post");

// CREATE POST
const createPost = async (req, res) => {
  try {
    const { title, content, categories, tags } = req.body;
    if (!title || !content)
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });

    const author = req.user.id;

    const newPost = new Post({
      title,
      content,
      author,
      categories: (categories || []).map((c) => c.trim().toLowerCase()),
      tags: (tags || []).map((t) => t.trim().toLowerCase()),
    });

    const savedPost = await newPost.save();

    const populatedPost = await savedPost.populate(
      "author",
      "username email role"
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: populatedPost,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// READ all posts (with optional category/tag filter)
const getPosts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category)
      filter.categories = req.query.category.toLowerCase();
    if (req.query.tag) filter.tags = req.query.tag.toLowerCase();

    const posts = await Post.find(filter)
      .populate("author", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email role"
    );
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Error in getPostById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE post (author only)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const { title, content, categories, tags } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (categories)
      post.categories = categories.map((c) => c.trim().toLowerCase());
    if (tags) post.tags = tags.map((t) => t.trim().toLowerCase());

    const updatedPost = await post.save();
    const populatedPost = await updatedPost.populate(
      "author",
      "username email role"
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: populatedPost,
    });
  } catch (error) {
    console.error("Error in updatePost:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE post (author or admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await post.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// LIKE / UNLIKE post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (!post.likes) post.likes = [];

    const userId = req.user.id;
    if (post.likes.includes(userId)) {
      post.likes.pull(userId); // unlike
    } else {
      post.likes.push(userId); // like
    }

    const updatedPost = await post.save();
    const populatedPost = await updatedPost.populate(
      "author",
      "username email role"
    );

    res.status(200).json({ success: true, data: populatedPost });
  } catch (error) {
    console.error("Error in toggleLike:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
};
