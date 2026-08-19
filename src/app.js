require("dotenv").config();
const express = require("express");
const { userAuth } = require("./middleware/auth");
const connectDB = require("./config/database");
const User = require("./models/user");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { validateSignUpData } = require("./utils/validation");

const app = express();
app.use(express.json());
app.use(cookieParser());

//signup api
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

//profile api
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

//deleting user
app.delete("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOneAndDelete({ email: userEmail });
    if (!user) {
      res.send("No User Found with that email");
    } else {
      res.send("User Deleted");
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong,",
      error: error.message,
    });
  }
});

//edit the user
app.patch("/user/:emailId", async (req, res) => {
  const userEmail = req.params.emailId;
  const data = req.body;
  try {
    const ALLOWED_EDIT_FIELDS = ["firstName", "lastName", "gender"];
    const isEditAllowed = Object.keys(data).every((k) =>
      ALLOWED_EDIT_FIELDS.includes(k),
    );
    if (!isEditAllowed) {
      throw new Error("Update for these fields are not allowed");
    }
    const user = await User.findOneAndUpdate({ email: userEmail }, data, {
      runValidators: true,
    });
    if (!user) {
      res.send("No User Found with that email");
    } else {
      res.send("User Updated");
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong,",
      error: error.message,
    });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.error("error connectig to the database", error);
  });
