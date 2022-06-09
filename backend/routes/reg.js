const { User, validate, validatePassword } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

//REGISTERING NEW USER
router.post("/", async (req, res) => {
  const dataError = validate(req.body).error;
  if (dataError)
    return res
      .status(400)
      .send("Joi USER DATA ERROR:" + dataError.details[0].message);

  const passwordError = validatePassword(req.body.password).error;
  if (passwordError)
    return res
      .status(400)
      .send("Joi PASSWORD ERROR:" + passwordError.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
  });

  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password", "links"]));
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
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "name"]));

  //   res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
