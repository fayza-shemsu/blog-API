require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes"); // admin routes
const setupSwagger = require("./swagger"); // swagger setup
const { notFound, errorHandler } = require("./middleware/errorMiddleware"); // optional error middleware

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Blog API");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes); // add admin routes

// Swagger API Documentation
setupSwagger(app);

// Error Handling Middleware (optional, professional practice)
app.use(notFound); // handle 404
app.use(errorHandler); // handle other errors

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
