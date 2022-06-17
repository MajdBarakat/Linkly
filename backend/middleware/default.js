const { nanoid } = require("nanoid");

module.exports = function (req, res, next) {
  const { type, order } = req.body;
  if (!type)
    return res
      .status(401)
      .send("Failed to create new link, no link type was chosen.");

  req.body = {
    order: order,
    linkName: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
    isVisible: false,
    linkURL: `https://`,
    linkPictureURL: `https://CDNLINK.com/`,
    linkThumbnailURL: `https://CDNLINK.com/`,
    linkDescription: "",
  };
  next();
};
