require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors"); 

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes"); 
const setupSwagger = require("./swagger"); 
const { notFound, errorHandler } = require("./middleware/errorMiddleware"); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); 


// Connect to MongoDB
connectDB();


app.get("/", (req, res) => {
  res.send("Welcome to Blog API");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

// Swagger API Documentation
setupSwagger(app);

// Error Handling Middleware 
app.use(notFound); // handle 404
app.use(errorHandler); // handle other errors


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
