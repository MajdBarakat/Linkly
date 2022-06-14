import React, { Component } from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import config from "../../config.json";
import Form from "./form";

class LoginFrom extends Form {
  state = {
    data: { name: "", password: "" },
    errors: {},
  };

  schema = {
    name: Joi.string().required().label("Name"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    const res = await http.get(config.api + "/auth");
    console.log("submitted", res);
  };

  render() {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </React.Fragment>
    );
  }
}

export default LoginFrom;
