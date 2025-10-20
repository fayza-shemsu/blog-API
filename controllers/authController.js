const User = require("../models/User");
const generateToken  = require ("../utils/generateToken");
const {validationResult} = require ("express-validator");


const registerUser = async ( req,res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return  res .status(400).json({errors:errors.array()});
        }
         const {name,email,password } = requestAnimationFrame.body;

         const exitingUser =await User.findOne ({email});
         if ( exitingUser){
            return  res.status (400).json ({message :"User already exists"});

         }

         const user = await User.create({name,email,password});

         res.status(201).json({
           _id:user._id,
           name:user.name ,
           email:user.email,
           role:user.role,
           token:generateToken(user._id),
    });
}
catch(error){
    console.error(error);
    res.status(500).json({message:"server Error"});
}
};

         
const loginUser = async(req,res) =>{
    try{
        const {email,password}= req.body;


        const user = await user.findone({email});
        if(!user){
            return  res .status(401).json({message:"Invalid email or password "});

        }

        
        const isMatch = await user.matchpassword (password);
        if(!isMatch){
            return res.status(401).json({message :"Invalid email or password "});
            }
           
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:generateToken(user._id),
            });
        
        }catch(error){
            console.error(error);
            res.status(500).json({message:"server Error"});

        }
        };
        module .exports = { registerUser ,loginUser };