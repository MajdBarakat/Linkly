import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import getUser from "../services/getUser";
import config from "../../config.json";
import { Component } from "react";

class Links extends Component {
  state = {
    data: {
      isVerified: false,
      profilePicURL: "",
      username: "",
      email: "",
      websiteTheme: "dark",
    },
    errors: {},
    loaded: false,
    links: [],
    fetchedLinks: [],
    newLinkType: "",
  };

  jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmFiMjQ5ZGE5OGJlMmU0ZGY3MDdlZTgiLCJpYXQiOjE2NTU0NzYzODR9.brnE-tV5jiFcnw8RFbxT7h1fjFeg_UiwX9c0hLl3YcE";

  async componentDidMount() {
    const result = await getUser(this.jwt);
    if (result) {
      const data = { ...this.state.data };
      const { profile } = result.appearance;
      data.isVerified = result.isVerified;
      data.profilePicURL = profile.profilePicURL;
      data.username = result.username;
      data.email = result.email;
      data.websiteTheme = result.settings.websiteTheme;
      this.state.links = result.links;
      this.setState({ data, loaded: true, fetchedLinks: this.state.links });
    }
  }

  async getLinks() {
    const result = await getUser(this.jwt);
    if (result) this.state.data.links = result.links;
  }

  schema = {
    id: Joi.string().required(),
    order: Joi.number().required(),
    linkName: Joi.string().min(1).max(50).required(),
    isVisible: Joi.boolean().required(),
    linkURL: Joi.string().min(3).max(255).required(),
    linkType: Joi.string().min(3).max(50).required(),
    linkPictureURL: Joi.string().min(3).max(50).required(),
    linkThumbnailURL: Joi.string().min(3).max(50).required(),
    linkDescription: Joi.string().allow("").max(255),
  };

  doAdd = async () => {
    const { data } = this.state;
    const result = await http
      .post(
        config.api + "/links/new",
        { type: data.newLinkType },
        { headers: { "x-auth-token": this.jwt } }
      )
      .catch((err) => alert(err.response.data));

    if (!result) return;

    console.log("Link added successfully!");
    this.getLinks();
    this.setState({ newLinkType: "" });
  };

  render() {
    if (!this.state.loaded) return <h1>Loading...</h1>;
    else {
      return (
        <React.Fragment>
          <h1>Profile</h1>
        </React.Fragment>
      );
    }
  }
}

export default Links;
