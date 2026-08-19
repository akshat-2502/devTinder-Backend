const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name field cannot be empty");
  } else if (firstName.length < 2 || lastName.length < 2) {
    throw new Error("First Name or Last Name cannot be less than 2");
  } else if (!validator.isEmail(email)) {
    throw new Error("E-mail is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};

module.exports = {
  validateSignUpData,
};
