
require ("dotenv").config();
const express = require ("express");
const connectDB =require ("./config/db");
const authRoutes = require ("./routes/authRoutes");
const postRoutes = require ("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app =express();

app.use(express.json());

connectDB();

app.get("/",(req,res) =>{
    res.send ( "Welcome  to Blog API");
});
 app.use("/api/auth",authRoutes);
 app.use("/api/posts",postRoutes);
 app.use("/api/comments", commentRoutes);


app.listen(5000, () =>{
    console.log("Server is running on port 5000");
});

