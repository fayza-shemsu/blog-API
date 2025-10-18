const express = require ("express");
const app =express();

app.use(express.json());

app.get("/",(req,res) =>{
    res.send ( "Welcome  to Blog API");
});

app.listen(5000, () =>{
    console.log("Server is running on port 5000");
});

