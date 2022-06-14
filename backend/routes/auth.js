const env = require("dotenv").config();
// const auth = require("../middleware/auth");
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("hello");
});

//LOGGING IN USER
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send("Joi USER DATA ERROR:" + dataError.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();

  res.send(token);
});

function validate(req) {
  console.log("validating");
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
