const Post = require("../models/post");

const createPost = async (req, res) => {
  try {
    const { title, content, categories } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }


    const author = req.user ? req.user.id : "67132b94f6ef9a1b2c10eab3";

    const newPost = new Post({
      title,
      content,
      author,
      categories,
    });

    const savedpost = await newPost.save();

    res.status(201).json({
      success: true,
      message: "post created succesfully",
      data: savedpost,
    });
  } catch (error) {
    console.error("Error creating post:", error.message);

    res.status(500).json({
      success: false,
      message: "server Error :Failed to create post",
      error: error.message,
    });
  }
};
module.exports = { createPost };
