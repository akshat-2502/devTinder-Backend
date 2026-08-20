const express = require("express");
const profileRoutes = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");

//getprofile api
profileRoutes.get("/profile", userAuth, async (req, res) => {
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

//edit user api

module.exports = profileRoutes;
