const env = require("dotenv").config();
const mongoose = require("mongoose");

module.exports = function () {
  //mongodb
  mongoose
    .connect("mongodb://127.0.0.1/playground")
    .then(() => console.log("Connected to mongoDB"))
    .catch((err) => console.log("ERROR", err));
};
