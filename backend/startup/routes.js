const error = require("../middleware/error");
const cors = require("cors");
const express = require("express");
const reg = require("../routes/reg");
const auth = require("../routes/auth");
const email = require("../routes/email");
const users = require("../routes/users");
const update = require("../routes/update");
const links = require("../routes/links");
const image = require("../routes/image");

module.exports = function (app) {
  //middleware
  app.use(express.json());
  app.use(cors());
  app.use("/api/register", reg); //REGISTER NEW USER
  app.use("/api/auth", auth); //LOGGING IN EXISTING USER
  app.use("/api/confirm", email);
  app.use("/api/users", users); //FIND OR DELETE USER
  app.use("/api/users", update); //UPDATING DETAILS
  app.use("/api/links", links); //UPDATING DETAILS
  app.use("/api/image", image); //ULOADING and DELETING IMAGES

  app.use(error);
};
