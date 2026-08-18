require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const { adminAuth } = require("./middleware/auth");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = req.body;
  console.log("data", data);
  try {
    const user = new User(data);
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).json({
      message: "Error Creating the User",
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
