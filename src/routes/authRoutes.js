const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    //VALIDATION OF DATA
    validateSignUpData(req);

    const { firstName, lastName, email, age, gender, password } = req.body;
    //Encription of password
    const hashPassword = await bcrypt.hash(password, 10);
    //saving the data in DB
    const user = new User({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: hashPassword,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).json({
      message: "Error Creating the User",
      error: error.message,
    });
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validator.isEmail(email)) {
      throw new Error("E-mail is not valid");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("No user found with that email");
    }
    const isPasswordCorrect = await user.validatePassword(password);
    if (isPasswordCorrect) {
      //creating a token
      const token = await user.getJWTToken();
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(401).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//logout api
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token").send("Logout Successful");
});

module.exports = authRouter;
