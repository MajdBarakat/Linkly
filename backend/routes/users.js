const { User } = require("../models/user");
const authMiddleware = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//VIEW CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user)
    return res.status(404).send("Something went wrong! User not found...");
  res.send(user);
});

//DELETE CURRENT USER
router.delete("/me", authMiddleware, async (req, res) => {
  const result = await User.deleteOne({ _id: req.user._id });
  if (!result)
    return res.status(404).send("Something went wrong! Failed to delete...");
  res.send(result);
});

module.exports = router;