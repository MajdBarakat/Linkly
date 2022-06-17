const { User } = require("../models/user");
const authMiddleware = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const formatter = require("../middleware/formatter");
const { urlencoded } = require("express");
const router = express.Router();

//VIEW CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -verificationToken"
  );
  if (!user)
    return res.status(404).send("Something went wrong! User not found...");
  res.send(user);
});

//UPDATE USER PROFILE
// router.post("/profile", authMiddleware, formatter, async (req, res) => {
//   const user = await User.findById(req.user._id);
//   if (!user)
//     return res.status(404).send("Something went wrong! User not found...");

//   user.appearance.profile = req.body.profile;
//   user.username = req.body.username;
//   user.email = req.body.email;
//   user.isAccountPrivate = req.body.isAccountPrivate;

//   try {
//     const result = await user.save();
//   } catch (err) {
//     return res.status(400).send(err);
//   }
//   res.send(result);
//   // try {
//   //   await User.updateOne(
//   //     { _id: user._id },
//   //     {
//   //       $set: {
//   //         profile: req.body.profile,
//   //       },
//   //     }
//   //   );
//   // } catch (err) {
//   //   return res.status(400).send("Something went wrong!");
//   // }
// });

//DELETE CURRENT USER
router.delete("/me", authMiddleware, async (req, res) => {
  const result = await User.deleteOne({ _id: req.user._id });
  if (!result)
    return res.status(404).send("Something went wrong! Failed to delete...");
  res.send(result);
});

module.exports = router;
