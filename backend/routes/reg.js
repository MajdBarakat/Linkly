const { User, validate, validatePassword } = require("../models/user");
const env = require("dotenv").config();
const nodemailer = require("nodemailer");
const formatter = require("../middleware/formatter");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const parser = require("../middleware/parser");
const router = express.Router();
const cors = require("cors")

//REGISTERING NEW USER
router.post("/", formatter, parser, cors(), async (req, res) => {
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

  if (username) return res.status(400).send("Username is already taken.");
  if (email) return res.status(400).send("User already registered.");

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
  // res.header("x-auth-token", token).send(_.pick(user, ["_id", "username"]));
  res.header("x-auth-token", token).send(token);

  //CHANGE POST PRODUCTION
  await sendConfirmationEmail(
    "",
    "",
    `http://localhost:3001/api/confirm/${user.verificationToken}`
  ).catch(res.send(error));

  //   res.send(_.pick(user, ["_id", "username", "email"]));
});

sendConfirmationEmail = async (email, username, link) => {
  let transporter = nodemailer.createTransport({
    host: "mx.mailslurp.com",
    port: 2525,
    auth: {
      user: process.env.mailname,
      pass: process.env.mailpassword,
    },
  });

  let info = await transporter.sendMail({
    from: '"Linkly" <noreply@linkly.com>', // sender address
    to: "76bbca9f-391d-475e-8e33-3283a048b3db@mailslurp.com", // list of receivers
    subject: "Hello", // Subject line
    html: `<b>To confirm your email, click <a href="${link}">this link</a></b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = router;
