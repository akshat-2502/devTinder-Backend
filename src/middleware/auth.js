const adminAuth = (req, res, next) => {
  console.log("admin middleware is running");
  const isAdmin = false;
  if (isAdmin) {
    next();
  } else {
    res.status(401).send("Unauthorized User");
  }
};

module.exports = {
  adminAuth,
};
