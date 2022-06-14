import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import config from "../../config.json";
import Form from "./form";

class LoginFrom extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().min(5).max(255).required().email().label("Email"),
    password: Joi.string().min(8).max(30).required().label("Password"),
  };

  doSubmit = async () => {
    const result = await http
      .post(config.api + "/auth", this.state.data)
      .catch((err) => alert(err.response.data));

    if (!result) return;

    console.log(
      "authenticated successfully! here is your token: ",
      result.data
    );
  };

  render() {
    return (
      <React.Fragment>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </React.Fragment>
    );
  }
}

export default LoginFrom;
