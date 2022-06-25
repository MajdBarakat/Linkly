import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import getUser from "../services/getUser";
import config from "../../config.json";
import { Component } from "react";
import Link from "./link";

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
      result.links = await this.initStates(result.links);
      this.state.links = result.links;
      const deepClone = JSON.parse(JSON.stringify(this.state.links));
      this.setState({
        data,
        loaded: true,
        fetchedLinks: deepClone,
      });
    }
  }

  async getLinks() {
    let { links } = await getUser(this.jwt);
    if (links) {
      this.setState({ links });
      const deepClone = JSON.parse(JSON.stringify(this.state.links));
      this.setState({
        fetchedLinks: deepClone,
      });
    } else return "An error occured while fetching links.";
  }

  initStates = (links) => {
    links.forEach((link) => (link.isEditing = false));
    return links;
  };

  schema = {
    id: Joi.string().required(),
    isEditing: Joi.boolean(),
    order: Joi.number().required(),
    linkName: Joi.string().min(1).max(50).required(),
    isVisible: Joi.boolean().required(),
    linkURL: Joi.string().min(3).max(255).required(),
    linkPictureURL: Joi.string().min(3).max(50).required(),
    linkThumbnailURL: Joi.string().min(3).max(50).required(),
    linkDescription: Joi.string().allow("").max(255),
  };

  handleAdd = async () => {
    const result = await http
      .post(
        config.api + "/links/new",
        { type: this.state.newLinkType },
        { headers: { "x-auth-token": this.jwt } }
      )
      .catch((err) => alert(err.response.data));

    if (!result) return;

    console.log("Link added successfully!");
    this.getLinks();
    this.setState({ newLinkType: "" });
  };

  handleDelete = async (link) => {
    const links = [...this.state.links];
    const index = links.indexOf(link);
    links.splice(index, 1);
    this.setState({ links });
    const result = await http
      .delete(config.api + `/links/delete/${link.id}`, {
        headers: { "x-auth-token": this.jwt, order: link.order },
      })
      .catch((err) => alert(err.response.data));

    await this.getLinks();
    if (!result) return;
    console.log("Link deleted successfully!");
  };

  handleSubmit = (e, link) => {
    e.preventDefault();
    let errors = this.validate(link);
    console.log("submitting", errors);
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit(link);
  };

  doSubmit = async (link) => {
    const copiedLink = { ...link };
    delete copiedLink.isEditing;
    const result = await http
      .put(config.api + "/links/edit", copiedLink, {
        headers: { "x-auth-token": this.jwt },
      })
      .catch((err) => alert(err.response.data));

    if (!result) return;

    console.log("Link edited successfully!", result);
    this.getLinks();
  };

  handleEdit = async (link) => {
    const links = [...this.state.links];
    const index = links.indexOf(link);
    links[index].isEditing = !links[index].isEditing;
    for (let i = 0; i < links.length; i++) {
      if (i !== index) links[i].isEditing = false;
    }
    this.setState({ links });

    const fetchedLinks = [...this.state.fetchedLinks];
    fetchedLinks[index].isEditing = links[index].isEditing;
    for (let i = 0; i < fetchedLinks.length; i++) {
      if (i !== index) fetchedLinks[i].isEditing = false;
    }
    this.setState({ fetchedLinks });
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    this.setState({ errors });

    const links = [...this.state.links];
    const index = links.findIndex((link) => link.id === input.parentElement.id);

    links[index][input.name] = input.value;

    this.setState({ links });
  };

  handleDiscard = (link, fetchedLink) => {
    const links = [...this.state.links];
    const index = links.indexOf(link);
    links[index] = JSON.parse(JSON.stringify(fetchedLink));
    this.setState({ links });
  };

  handleVisibility = async (link) => {
    const links = [...this.state.links];
    const index = links.indexOf(link);
    links[index].isVisible = !links[index].isVisible;
    this.setState({ links });

    const copiedLink = { ...link };
    delete copiedLink.isEditing;
    const result = await http
      .put(config.api + "/links/vis-toggle", copiedLink, {
        headers: { "x-auth-token": this.jwt },
      })
      .catch((err) => alert(err.response.data));

    if (!result) return;
    const fetchedLinks = [...this.state.fetchedLinks];
    fetchedLinks[index].isVisible = links[index].isVisible;
    this.setState({ fetchedLinks });

    console.log("Link visibility edited successfully!", result);
  };

  validate = (link) => {
    const options = { abortEarly: false };
    const index = this.state.links.indexOf(link);
    const { error } = Joi.validate(
      this.state.links[index],
      this.schema,
      options
    );
    if (!error) return null;
    const errors = {};
    error.details.forEach(
      (error) => (errors[error.path[0]] = this.cleanErr(error.message))
    );
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    let result;
    const schema = { [name]: this.schema[name] };
    result = Joi.validate(obj, schema);
    const { error } = result;
    return error ? this.cleanErr(error.details[0].message) : null;
  };

  cleanErr = (error) => {
    return error.replace(/[^\s]*/, "value");
  };

  render() {
    if (!this.state.loaded) return <h1>Loading...</h1>;
    else {
      return (
        <div className="middle-container links">
          <h1>Links</h1>
          {this.state.links.map((link) => (
            <Link
              key={link.id}
              link={link}
              fetchedLink={
                this.state.fetchedLinks[this.state.links.indexOf(link)]
              }
              isEditing={this.isEditing}
              onEdit={this.handleEdit}
              onChange={this.handleChange}
              onDelete={this.handleDelete}
              onSubmit={this.handleSubmit}
              onDiscard={this.handleDiscard}
              onToggleVisiblity={this.handleVisibility}
              errors={this.state.errors}
            />
          ))}
        </div>
      );
    }
  }
}

export default Links;
