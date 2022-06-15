import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import config from "../../config.json";
import Form from "./form";

class Profile extends Form {
  state = {
    data: {
      profilePicURL: "",
      name: "",
      title: "",
      username: "",
      email: "",
      bio: "",
      isAccountPrivate: "",
      websiteTheme: "",
    },
    errors: {},
  };

  schema = {
    profilePicURL: Joi.string()
      //   .min(5)
      //   .max(255)
      //   .required()
      //   .uri()
      .label("Profile"),
    name: Joi.string().max(30).label("Name"),
    title: Joi.string().min(3).max(30).label("Title"),
    username: Joi.string().min(3).max(255).required().label("UserName"),
    email: Joi.string().min(5).max(255).required().email().label("Email"),
    bio: Joi.string().max(50).label("Bio"),
    isAccountPrivate: Joi.boolean().label("Privacy"),
    websiteTheme: Joi.string().min(1).max(30).required().label("Website Theme"),
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
      <React.Fragment>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("title", "Title")}
          {this.renderInput("username", "Username")}
          {this.renderInput("email", "Email")}
          {this.renderInput("bio", "Bio")}
          {this.renderInput("isAccountPrivate", "Account Privacy")}
        </form>
        {this.renderButton("Login")}
      </React.Fragment>
    );
  }
}

export default Profile;
