const express = require("express");
const router= express.Router();
const {body}= require("express-validator");
const {registerUser,loginUser}= require("../controllers/authController");

router.post(
"/register",
[
   body("name").notEmpty().withMessage("Nameis required"),
    body("email").isEmail().withMessage("valid email is required"),
    body("password").isLength({min:6}).withMessage ("password must be at least 6 characters"),


],
registerUser
);


router.post(
    "/login",
    [
        body ("email").isEmail().withMessage ("valid email is required"),
        body ("password").exists().withMessage("password is required")

    ],
    loginUser
);
 module.exports = router;