const { User, validate, validatePassword } = require("../models/user");
const env = require("dotenv").config();
const aws = require("aws-sdk")
const formatter = require("../middleware/formatter");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const parser = require("../middleware/parser");
const router = express.Router();

aws.config.update({
  credentials: {
    secretAccessKey: process.env.accessSecret,
    accessKeyId: process.env.accessKey,
  },
  region: process.env.region
})

//REGISTERING NEW USER
router.post("/", formatter, parser, async (req, res) => {
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
    req.body.email,
    req.body.username,
    `${process.env.API}/confirm/${user.verificationToken}`
  ).catch(res.send(error));

  //   res.send(_.pick(user, ["_id", "username", "email"]));
});

sendConfirmationEmail = async (email, username, link) => {

  const params = {
    Destination: { /* required */
      CcAddresses: [],
      ToAddresses: [email]
    },
    Message: { 
      Body: { 
        Html: {
         Charset: "UTF-8",
         Data: `<b>To confirm your email, click <a href="${link}">this link</a></b>`
        },
        Text: {
         Charset: "UTF-8",
         Data: `Welcome to Linkly ${username}!`
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: 'Linkly Email Verification'
       }
      },
    Source: 'majdbarakat.dev@gmail.com',
    ReplyToAddresses: [],
  };

  const sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
  sendPromise.then((data) => {
    console.log("Message sent: ",data.MessageId);
  }).catch((err) => {
    console.error(err, err.stack);
  });

};

module.exports = router;
