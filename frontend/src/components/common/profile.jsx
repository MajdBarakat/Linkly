import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import getUser from "../services/getUser";
import config from "../../config.json";
import Form from "./form";

class Profile extends Form {
  state = {
    data: {
      isVerified: false,
      profilePicURL: "",
      profilePicShape: 0,
      name: "",
      title: "",
      username: "",
      email: "",
      bio: "",
      isAccountPrivate: true,
      websiteTheme: "dark",
    },
    errors: {},
    loaded: false,
    fetchedData: {},
  };

  jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmFiMjQ5ZGE5OGJlMmU0ZGY3MDdlZTgiLCJpYXQiOjE2NTUzODYyMzR9.QZIjnTUbdx5wnaP4rUmXKxEnmfW2DVfkB2nyKuU8Gfo";

  async componentDidMount() {
    const result = await getUser(this.jwt);
    if (result) {
      const data = { ...this.state.data };
      const { profile } = result.appearance;
      data.isVerified = result.isVerified;
      data.profilePicURL = profile.profilePicURL;
      data.profilePicShape = profile.profilePicShape;
      data.name = profile.name;
      data.title = profile.title;
      data.username = result.username;
      data.email = result.email;
      data.bio = profile.bio;
      data.isAccountPrivate = result.settings.isAccountPrivate;
      data.websiteTheme = result.settings.websiteTheme;
      this.setState({ data, loaded: true, fetchedData: data });
    }
  }

  schema = {
    isVerified: Joi.boolean(),
    // profilePicURL: Joi.string().min(5).max(255).uri().label("Profile Pic"),
    profilePicURL: Joi.string().min(5).max(255).label("Profile Pic"),
    profilePicShape: Joi.number().label("Profile Shape"),
    name: Joi.string().allow("").max(30).label("Name"),
    title: Joi.string().allow("").max(30).label("Title"),
    username: Joi.string().min(3).max(255).required().label("Username"),
    email: Joi.string().min(5).max(255).required().email().label("Email"),
    bio: Joi.string().allow("").max(80).label("Bio"),
    isAccountPrivate: Joi.boolean().label("Privacy"),
    websiteTheme: Joi.string().min(1).max(30).required().label("Website Theme"),
  };

  formatInput = () => {
    const data = { ...this.state.data };
    data.username = data.username.toLowerCase().trim();
    // data.email = data.email.toLowerCase().trim();
    this.setState({ data: data });
  };

  doSubmit = async () => {
    await this.formatInput();
    const { data } = this.state;
    const result = await http
      .put(
        config.api + "/users/update",
        {
          appearance: {
            profile: {
              profilePicURL: data.profilePicURL,
              profilePicShape: data.profilePicShape,
              name: data.name,
              title: data.title,
              bio: data.bio,
            },
          },
          email: data.email,
          bio: data.bio,
          settings: {
            isAccountPrivate: data.isAccountPrivate,
          },
        },
        { headers: { "x-auth-token": this.jwt } }
      )
      .catch((err) => alert(err.response.data));

    if (!result) return;

    console.log("Profile updated successfully!");
    this.setState({ fetchedData: this.state.data });
  };

  render() {
    const valuesChanged = !(
      JSON.stringify(this.state.data) === JSON.stringify(this.state.fetchedData)
    );
    const { isVerified, isAccountPrivate } = this.state.data;
    if (!this.state.loaded) return <h1>Loading...</h1>;
    else {
      return (
        <div className="middle-container profile">
          <h1>Profile</h1>
          <form class="container profile" onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name")}
            {this.renderInput("title", "Title")}
            {this.renderInput("username", "Username")}
            {this.renderInput("email", "Email")}
            {this.renderInput("bio", "Bio")}
            <div className="profile-bottom">
              {this.renderSelect(
                "isAccountPrivate",
                "Account Privacy",
                isVerified ? "" : "verify email to publish account",
                isAccountPrivate,
                [
                  { value: false, label: "Public" },
                  { value: true, label: "Private" },
                ]
              )}
              <div className="buttons">
                {valuesChanged
                  ? this.renderButton(
                      "Cancel",
                      "medium",
                      false,
                      "discard",
                      "button"
                    )
                  : ""}
                {this.renderButton("Save", !valuesChanged)}
              </div>
            </div>
          </form>
        </div>
      );
    }
  }
}

export default Profile;
