const { nanoid } = require("nanoid");
const config = require("../config.json");

module.exports = function (req, res, next) {
  const data = req.body;
  if (data.email) data.email = data.email.toLowerCase();
  if (data.username) data.username = data.username.toLowerCase();
  data.isVerified = false;
  data.verificationToken = nanoid();
  data.links = config.defaultLinks;
  data.appearance = config.defaultAppearance;
  data.settings = config.defaultSettings;
  req.body = data;
  next();
};
