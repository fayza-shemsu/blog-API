const crypto = require("crypto");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../config/mailConfig"); 

// 📩 Register User + Send Email Verification
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    //  Store as Date object, not number
    const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    //  Create user (unverified)
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
    });

    //  Send verification email using SendGrid
    const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify your email address",
      `
        <h2>Welcome, ${user.name} 👋</h2>
        <p>Thanks for registering on our platform! Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}" 
           style="background:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
          Verify Email
        </a>
        <p>This link expires in 1 hour.</p>
      `
    );

    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log("Verification token received:", token);

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      console.log("No user found with this token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    
    if (
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < Date.now()
    ) {
      console.log("Token expired for user:", user.email);
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log("User verified successfully:", user.email);
    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { registerUser, verifyEmail, loginUser };
