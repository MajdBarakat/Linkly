module.exports = function (err, req, res, next) {
  //log err if u want
  res.status(500).send("Something went wrong!");
};
