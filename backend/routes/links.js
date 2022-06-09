const { User } = require("../models/user");
const authMiddleware = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

//CHANGING SPECIFIC LINK
router.put("/edit", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  //validate they are string
  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  const link = req.body;

  const index = user.links
    .map(function (x) {
      return x.id;
    })
    .indexOf(link.id);

  if (!link) return res.status(400).send("Something went wrong!");

  if (!user.links[index] || index === -1)
    return res.status(404).send("Something went wrong! Link not found...");

  try {
    const linkToUpdate = `links.${index}`;
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          [linkToUpdate]: link,
        },
      }
    );
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }

  res.send(_.pick(user, ["_id", "name", "email", "links"]));
});

//ADDING LINKS
router.post("/new", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  //validate they are string

  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  const link = req.body;

  const id =
    user.links.length > 0
      ? parseInt(user.links[user.links.length - 1].id) + 1
      : 1;

  if (!link) return res.status(400).send("Something went wrong!");

  try {
    user.links.push({
      id: id,
      linkName: link.linkName,
      linkType: link.linkType,
      linkURL: link.linkURL,
      linkDescription: link.linkDescription,
    });
    await user.save();
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }

  res.send(_.pick(user, ["_id", "name", "email", "links"]));
});

//DELETING SPECIFIC
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  const linkToDelete = req.params.id;

  const index = user.links
    .map(function (x) {
      return x.id;
    })
    .indexOf(linkToDelete);

  if (!linkToDelete) return res.status(400).send("Something went wrong!");

  if (!user.links[index] || index === -1)
    return res.status(404).send("Something went wrong! Link not found...");

  try {
    user.links.splice(index, 1);
    await user.save();
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }

  res.send(_.pick(user, ["_id", "name", "email", "links"]));
});

module.exports = router;
