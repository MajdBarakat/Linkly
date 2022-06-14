import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import config from "../../config.json";
import Form from "./form";

class RegisterForm extends Form {
  state = {
    data: { username: "", email: "", password: "", links: [] },
    errors: {},
  };

  schema = {
    username: Joi.string().min(3).max(255).required().label("UserName"),
    email: Joi.string().min(5).max(255).required().email().label("Email"),
    password: Joi.string().min(8).max(30).required().label("Password"),
    links: Joi.array(),
  };

  doSubmit = async () => {
    const result = await http
      .post(config.api + "/register", this.state.data)
      .catch((err) => alert(err.response.data));
    if (!result) return;

    console.log("Registered successfully!", result.data);
  };

  render() {
    return (
      <React.Fragment>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("email", "Email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Create Account")}
        </form>
      </React.Fragment>
    );
  }
}

export default RegisterForm;
