const env = require("dotenv").config();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");
const { string, bool, number } = require("joi");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 20 },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: { type: String, required: true, minlength: 8, maxlength: 1024 },
  isVerified: { type: Boolean, required: true },
  verificationToken: { type: String, maxlength: 22 },
  links: { type: Array },
  appearance: { type: Object },
  settings: { type: Object },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.jwtPrivateKey);
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().lowercase().min(3).max(20).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
    isVerified: Joi.boolean().required(),
    verificationToken: Joi.string().max(22),
    links: Joi.array(),
    appearance: Joi.object(),
    settings: Joi.object(),
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

function validateLink(link) {
  const schema = Joi.object({
    id: Joi.string().required(),
    order: Joi.number().required(),
    linkName: Joi.string().min(1).max(50).required(),
    isVisible: Joi.boolean().required(),
    linkURL: Joi.string().min(3).max(255).required(),
    bannerURL: Joi.string(),
    thumbnailURL: Joi.string(),
    linkDescription: Joi.string().allow("").max(255),
  });
  return schema.validate(link);
}

exports.User = User;
exports.validate = validateUser;
exports.validatePassword = validateUserPassword;
exports.validateLink = validateLink;
