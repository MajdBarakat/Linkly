const { User, validateLink } = require("../models/user");
const authMiddleware = require("../middleware/auth");
const assignDefaults = require("../middleware/default");
const _ = require("lodash");
const express = require("express");
const { nanoid } = require("nanoid");
const { flatten } = require("lodash");
const router = express.Router();

//ADDING LINKS
router.post("/new", authMiddleware, assignDefaults, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  const dataError = validateLink(req.body).error;
  if (dataError)
    return res
      .status(400)
      .send("Joi USER DATA ERROR:" + dataError.details[0].message);

  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  const link = req.body;

  if (!link) return res.status(400).send("Something went wrong!");

  try {
    user.links.push({
      id: link.id,
      order: link.order,
      linkName: link.linkName,
      isVisible: link.isVisible,
      linkURL: link.linkURL,
      linkPictureURL: link.linkPictureURL,
      linkThumbnailURL: link.linkThumbnailURL,
      linkDescription: link.linkDescription,
    });
    await user.save();

    const reOrdered = await updateOrder(link.id, link.order, user.links);
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          links: reOrdered,
        },
      }
    );
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }

  res.send(_.pick(user, ["_id", "name", "email", "links"]));
});

//CHANGING SPECIFIC LINK
router.put("/edit", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  const dataError = validateLink(req.body).error;
  if (dataError)
    return res
      .status(400)
      .send("Joi USER DATA ERROR:" + dataError.details[0].message);

  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  const link = req.body;
  const index = user.links.findIndex((x) => x.id === link.id);

  if (!link) return res.status(400).send("Something went wrong!");

  if (!user.links[index] || index === -1)
    return res.status(404).send("Something went wrong! Link not found...");

  try {
    const reOrdered = await updateOrder(link.id, link.order, user.links);
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          links: reOrdered,
        },
      }
    );
  } catch (err) {
    return res
      .status(400)
      .send("Something went wrong with re-ordering the links");
  }

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

//CHANGING VISIBILITY OF A LINK
router.put("/vis-toggle", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  const dataError = validateLink(req.body).error;
  if (dataError)
    return res
      .status(400)
      .send("Joi USER DATA ERROR:" + dataError.details[0].message);

  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  const link = req.body;
  const index = user.links.findIndex((x) => x.id === link.id);

  if (!link) return res.status(400).send("Something went wrong!");

  if (!user.links[index] || index === -1)
    return res.status(404).send("Something went wrong! Link not found...");

  try {
    const valueToUpdate = `links.${index}.isVisible`;
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          [valueToUpdate]: link.isVisible,
        },
      }
    );
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }

  res.send(_.pick(user, ["_id", "name", "email", "links"]));
});

//CHANGING ORDER OF A LINK
router.put("/change-order", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  // const dataError = validateLink(req.body).error;
  // if (dataError)
  //   return res
  //     .status(400)
  //     .send("Joi USER DATA ERROR:" + dataError.details[0].message);

  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  const request = req.body;
  const index = user.links.findIndex((x) => x.id === request.id);
  if (!request) return res.status(400).send("Something went wrong!");

  if (!user.links[index] || index === -1)
    return res.status(404).send("Something went wrong! Link not found...");

  let links = [...user.links];
  links.forEach((link) => {
    if (link.id !== request.id) {
      if (request.up) {
        if (link.order <= request.destination && link.order > request.source)
          link.order -= 1;
      } else {
        if (link.order >= request.destination && link.order < request.source)
          link.order += 1;
      }
    } else link.order = request.destination;
  });

  try {
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          links: links,
        },
      }
    );
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }

  res.send("Order changed successfully!");
});

//DELETING SPECIFIC
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user)
    return res.status(404).send("Something went wrong! User not found...");

  const linkToDelete = user.links.find((link) => link.id === req.params.id);

  const index = user.links.indexOf(linkToDelete);

  if (!linkToDelete) return res.status(400).send("Something went wrong!");

  if (!user.links[index] || index === -1)
    return res.status(404).send("Something went wrong! Link not found...");

  try {
    user.links.splice(index, 1);
    const result = await user.save();

    const reOrdered = await updateOrderAfterDelete(
      req.headers.order,
      user.links
    );
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          links: reOrdered,
        },
      }
    );
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }

  res.send(_.pick(user, ["_id", "name", "email", "links"]));
});

updateOrder = (id, order, arr) => {
  if (arr.find((link) => link.id !== id && link.order === order)) {
    arr.forEach((link) => {
      if (link.order >= order && link.id !== id) link.order += 1;
    });
  }
  return arr;
};

updateOrderAfterDelete = (order, arr) => {
  arr.forEach((link) => {
    if (link.order > order) link.order -= 1;
  });
  return arr;
};

module.exports = router;
