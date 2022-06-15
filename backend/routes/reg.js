const { User, validate, validatePassword } = require("../models/user");
const formatter = require("../middleware/formatter");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

//REGISTERING NEW USER
router.post("/", formatter, async (req, res) => {
  const error = validate(req.body).error;
  if (error)
    return res
      .status(400)
      .send("Joi USER DATA ERROR:" + error.details[0].message);

  const passwordError = validatePassword(req.body.password).error;
  if (passwordError)
    return res
      .status(400)
      .send("Joi PASSWORD ERROR:" + passwordError.details[0].message);

  let email = await User.findOne({
    email: req.body.email,
  });

  let username = await User.findOne({
    username: req.body.username,
  });

  if (email) return res.status(400).send("User already registered.");
  if (username) return res.status(400).send("Username is already taken.");

  user = new User(
    _.pick(req.body, [
      "username",
      "email",
      "password",
      "isVerified",
      "verificationToken",
      "links",
      "appearance",
      "settings",
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    const result = await user.save();
  } catch (err) {
    let errList = [];
    for (const field in err.errors) {
      errList.push(err.errors[field].message);
    }
    return res.status(400).send("mongoose ERROR: " + errList);
  }

  //header auth token - after registry
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "username"]));

  //   res.send(_.pick(user, ["_id", "username", "email"]));
});

module.exports = router;
