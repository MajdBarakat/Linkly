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

  formatInput = () => {
    const data = { ...this.state.data };
    // data.username = data.username.toLowerCase().trim();
    data.email = data.email.toLowerCase().trim();
    this.setState({ data: data });
  };

  doSubmit = async () => {
    await this.formatInput();
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
      <div className="sign-in">
        <h1>
          Sign In to <span>Linkly</span>
        </h1>
        <form className="container sign-in" onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email address", "example@email.com")}
          {this.renderInput(
            "password",
            "Password",
            "",
            { text: "", label: "Forgot password?", href: "" },
            "password"
          )}
          {this.renderButton("Sign In")}
          <div className="under-text-container">
            <div className="text-help">
              New to Linkly?
              <a href=""> Register</a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginFrom;
