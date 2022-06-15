const env = require("dotenv").config();
// const auth = require("../middleware/auth");
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/:token", async (req, res) => {
  let user = await User.findOne({
    verificationToken: req.params.token,
  });
  if (!user) return res.status(400).send("Token is invalid.");

  if (user.isVerified === true)
    return res.status(400).send("User is already verified.");

  user.isVerified = true;
  user.verificationToken = undefined;
  try {
    const result = await user.save();
  } catch (err) {
    return res.status(400).send(err);
  }
  res.send("User has been successfully verified!");
});

module.exports = router;
