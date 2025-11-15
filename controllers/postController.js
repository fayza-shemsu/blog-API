const Post = require("../models/post");
const cloudinary = require("../config/cloudinary");

//  CREATE POST
const createPost = async (req, res) => {
  try {
    let { title, content, categories, tags } = req.body;

    if (!title || !content)
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });

    const author = req.user.id;

    
    categories =
      typeof categories === "string"
        ? categories.split(",").map((c) => c.trim().toLowerCase())
        : Array.isArray(categories)
        ? categories.map((c) => c.trim().toLowerCase())
        : [];

    tags =
      typeof tags === "string"
        ? tags.split(",").map((t) => t.trim().toLowerCase())
        : Array.isArray(tags)
        ? tags.map((t) => t.trim().toLowerCase())
        : [];

    const newPost = new Post({
      title,
      content,
      author,
      categories,
      tags,
    });

    // Upload image to Cloudinary 
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
      });
      newPost.imageUrl = result.secure_url;
      newPost.imagePublicId = result.public_id;
    }

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

//  GET ALL POSTS
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

//  GET POST BY ID
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

// UPDATE POST (with optional image replacement)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    let { title, content, categories, tags } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;

    
    if (categories) {
      categories =
        typeof categories === "string"
          ? categories.split(",").map((c) => c.trim().toLowerCase())
          : Array.isArray(categories)
          ? categories.map((c) => c.trim().toLowerCase())
          : [];
      post.categories = categories;
    }

    if (tags) {
      tags =
        typeof tags === "string"
          ? tags.split(",").map((t) => t.trim().toLowerCase())
          : Array.isArray(tags)
          ? tags.map((t) => t.trim().toLowerCase())
          : [];
      post.tags = tags;
    }

    // Handle image update
    if (req.file) {
      // delete old image from Cloudinary
      if (post.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(post.imagePublicId);
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }

      // upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
      });

      post.imageUrl = result.secure_url;
      post.imagePublicId = result.public_id;
    }

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

    
    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
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
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
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
