const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // console.log("COOKIES:", req.cookies);
    // console.log("TOKEN:", token);
    if (!token) {
      return res.status(401).json({
        message: "Please Login First",
      });
    }

    const tokenValidation = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      email: tokenValidation.email,
    });

    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
      error: error.message,
    });
  }
};

module.exports = {
  userAuth,
};
