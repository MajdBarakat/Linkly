const env = require("dotenv").config();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlenght: 50 },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 255,
    unique: true,
  },
  password: { type: String, required: true, minlength: 8, maxlenght: 1024 },
  links: { type: Array },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.jwtPrivateKey);
};

const User = mongoose.model("User", userSchema);
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    links: Joi.array(),
  });
  return schema.validate(user);
}

function validateUserPassword(password) {
  const complexity = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 4,
  };
  return passwordComplexity(complexity).validate(password);
}

exports.User = User;
exports.validate = validateUser;
exports.validatePassword = validateUserPassword;
