const { User, validatePassword } = require("../models/user");
const authMiddleware = require("../middleware/auth");
const formatter = require("../middleware/formatter");
const _ = require("lodash");
const express = require("express");
const flatten = require("../middleware/flatten");
const router = express.Router();

//Update Details
router.put("/update", authMiddleware, formatter, flatten, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const entries = Object.entries(req.body);
  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  if (entries.length === 0) return res.send("Nothing was changed..");
  //   console.log(details);

  for (const entry of entries) {
    if (entry[0].endsWith == "password") {
      const passwordError = validatePassword(req.body.password).error;
      if (passwordError)
        return res
          .status(400)
          .send("Joi PASSWORD ERROR:" + passwordError.details[0].message);
    }
    // else if (entry[0] === "email" || entry[0] === "_id")
    // return res.status(502).send(`Cannot change ${entry[0]} value!`);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          [entry[0]]: entry[1],
        },
      }
    );
  }
  res.send("Values changed successfully...");
});

module.exports = router;
