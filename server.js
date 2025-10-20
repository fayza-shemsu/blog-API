
require ("dotenv").config();
const express = require ("express");
const connectDB =require ("./config/db");
const authRoutes = require ("./routes/authRoutes");
const app =express();

app.use(express.json());

connectDB();

app.get("/",(req,res) =>{
    res.send ( "Welcome  to Blog API");
});
 app.use("/api/auth",authRoutes);

app.listen(5000, () =>{
    console.log("Server is running on port 5000");
});

