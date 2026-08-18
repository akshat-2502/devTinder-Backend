require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");

const { adminAuth } = require("./middleware/auth");
const app = express();

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
