import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
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

  doSubmit = () => {
    console.log("submitted");
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
