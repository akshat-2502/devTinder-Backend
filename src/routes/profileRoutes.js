const express = require("express");
const profileRoutes = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

//getprofile api
profileRoutes.get("/profile/view", userAuth, async (req, res) => {
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
profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
  const data = req.body;
  try {
    validateEditProfileData(req);
    const loggedinUser = req.user;
    Object.keys(data).forEach((key) => {
      loggedinUser[key] = data[key];
    });
    await loggedinUser.save();
    res.send("Profile Updated Successfully");
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = profileRoutes;
