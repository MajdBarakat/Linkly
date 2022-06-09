const { User, validatePassword } = require("../models/user");
const authMiddleware = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//Update Details
router.put("/update", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const details = req.body.detailsToUpdate;
  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  if (details.length === 0) return res.send("Nothing was changed..");
  //   console.log(details);

  for (const detail of details) {
    if (detail.detailToChange == "password") {
      const passwordError = validatePassword(req.body.password).error;
      if (passwordError)
        return res
          .status(400)
          .send("Joi PASSWORD ERROR:" + passwordError.details[0].message);
    } else if (
      detail.detailToChange == "email" ||
      detail.detailToChange == "_id"
    )
      return res
        .status(502)
        .send(`Cannot change ${detail.detailToChange} value!`);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          [detail.detailToChange]: detail.newValue,
        },
      }
    );
  }
  res.send("Values changed successfully...");
});

module.exports = router;
