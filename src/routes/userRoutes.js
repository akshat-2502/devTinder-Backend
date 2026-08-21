const express = require("express");

const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const { Connection } = require("mongoose");

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedinUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName profilePhotoUrl gender skills about",
    );

    const data = connectionRequests.map((key) => {
      return key.fromUserId;
    });

    res.json({
      message: "Connection Request Fetched Successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedinUser._id, status: "accepted" },
        { toUserId: loggedinUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName profilePhotoUrl gender skills about",
      )
      .populate(
        "toUserId",
        "firstName lastName profilePhotoUrl gender skills about",
      );
    const data = connectionRequests.map((key) => {
      if (key.fromUserId._id.toString() === loggedinUser._id.toString()) {
        return key.toUserId;
      } else {
        return key.fromUserId;
      }
    });
    res.json({
      message: "Connections Fetched Successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = userRouter;
