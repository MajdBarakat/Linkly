const env = require("dotenv").config();

module.exports = function () {
  //env vars
  if (!process.env.jwtPrivateKey) {
    console.error("FATAL ERROR: jwtPrivateKey is undefined!");
    process.exit(1);
  }
};
