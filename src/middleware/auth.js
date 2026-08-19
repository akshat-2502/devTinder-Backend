const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  const tokenValidation = await jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenValidation) {
    throw new Error("Invalid Token Please Login Again");
  }
  const user = await User.findOne({ email: tokenValidation?.email });
  if (!user) {
    throw new Error("User Not Found");
  }
  req.user = user;
  next();
};
module.exports = {
  userAuth,
};
