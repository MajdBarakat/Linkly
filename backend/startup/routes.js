const error = require("../middleware/error");
const express = require("express");
const reg = require("../routes/reg");
const auth = require("../routes/auth");
const users = require("../routes/users");
const update = require("../routes/update");
const links = require("../routes/links");

module.exports = function (app) {
  //middleware
  app.use(express.json());
  app.use("/api/register", reg); //REGISTER NEW USER
  app.use("/api/auth", auth); //LOGGING IN EXISTING USER
  app.use("/api/users", users); //FIND OR DELETE USER
  app.use("/api/users/me", update); //UPDATING DETAILS
  app.use("/api/links", links); //UPDATING DETAILS

  app.use(error);
};
