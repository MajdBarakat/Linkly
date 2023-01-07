import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import config from "../../config.json";
import Form from "./form";
import { Link } from "react-router-dom";

class RegisterForm extends Form {
  state = {
    data: {
      username: "",
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    username: Joi.string().min(3).max(255).required().label("Username"),
    email: Joi.string().min(5).max(255).required().email().label("Email"),
    password: Joi.string().min(8).max(30).required().label("Password"),
  };

  formatInput = () => {
    const data = { ...this.state.data };
    data.username = data.username.toLowerCase().trim();
    data.email = data.email.toLowerCase().trim();
    this.setState({ data: data });
  };

  doSubmit = async () => {
    await this.formatInput();
    const result = await http
      .post(config.api + "/register", this.state.data)
      .catch((err) => alert(err.response.data));
    if (!result) return;

    console.log("Registered successfully!", result.data);
  };

  render() {
    return (
      <div className="middle-container register">
        <h1>
          Register to <span>Linkly</span>
        </h1>
        <form className="container register" onSubmit={this.handleSubmit}>
          {this.renderInput(
            "username",
            "Username",
            "http://linkly.com/username"
          )}
          {this.renderInput("email", "Email address", "example@email.com")}
          {this.renderInput(
            "password",
            "Password",
            "",
            {
              text: "",
              label: "Need Help?",
              href: "",
            },
            "password"
          )}
          {this.renderButton("Create Account", "full-width primary-btn")}
          <div className="under-text-container">
            <div className="text-help">
              Already a member?
              <Link to="/login"> Sign In</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
