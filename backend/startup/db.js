const env = require("dotenv").config();
const mongoose = require("mongoose");

module.exports = function () {
  //mongodb
  mongoose
    .connect("mongodb://localhost:27017/playground")
    .then(() => console.log("Connected to mongoDB"))
    .catch((err) => console.log("ERROR", err));
};
