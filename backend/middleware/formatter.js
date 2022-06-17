module.exports = function (req, res, next) {
  const data = req.body;
  if (data.email) data.email = data.email.toLowerCase();
  if (data.username) data.username = data.username.toLowerCase();
  req.body = data;
  next();
};
