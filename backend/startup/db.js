const env = require("dotenv").config();
const mongoose = require("mongoose");

module.exports = function () {
  //mongodb
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to mongoDB"))
    .catch((err) => console.log("ERROR", err));
};
