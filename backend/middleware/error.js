module.exports = function (err, req, res, next) {
  //log err if u want
  console.log(err);
  res.status(500).send("Something went wrong!");
};
