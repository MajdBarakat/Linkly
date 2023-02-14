const { nanoid } = require("nanoid");

module.exports = function (req, res, next) {
  const { name, order } = req.body;

  req.body = {
    id: nanoid(10),
    order: order ? order : 0,
    linkName: name ? name : "New Link",
    isVisible: false,
    linkURL: `https://`,
    bannerURL: `https://CDNLINK.com/`,
    thumbnailURL: `https://CDNLINK.com/`,
    linkDescription: "",
  };
  next();
};
