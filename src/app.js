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
const authRouter = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const requestRouter = require("./routes/requestRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());

//auth router
app.use("/", authRouter);
//profile router
app.use("/", profileRoutes);
//request router
app.use("/", requestRouter);

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
