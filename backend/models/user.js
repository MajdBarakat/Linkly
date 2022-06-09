const env = require("dotenv").config();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: { type: String, required: true, minlength: 8, maxlength: 1024 },
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

// const linkSchema = new mongoose.Schema({
//   linkName: { type: String, required: true, minlength: 1, maxlength: 50 },
//   linkURL: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 255,
//   },
//   linkType: { type: String, required: true, minlength: 3, maxlength: 50 },
//   linkDescription: {
//     type: String,
//     required: false,
//     maxlength: 255,
//   },
// });

function validateLink(link) {
  const schema = Joi.object({
    linkName: Joi.string().min(1).max(50).required(),
    linkURL: Joi.string().min(3).max(255).required(),
    linkType: Joi.string().min(3).max(50).required(),
    linkDescription: Joi.string().max(255),
  });
  return schema.validate(link);
}

exports.User = User;
exports.validate = validateUser;
exports.validatePassword = validateUserPassword;
exports.validateLink = validateLink;
