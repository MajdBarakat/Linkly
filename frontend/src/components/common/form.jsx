import React, { Component } from "react";
import Joi from "joi-browser";
import passwordJoi from "joi-password-complexity";
import Input from "./input";

class Form extends Component {
  state = { data: {}, errors: {} };

  visited = [];

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;
    const errors = {};
    error.details.forEach(
      (error) => (errors[error.path[0]] = this.cleanErr(error.message))
    );
    return errors;
  };

  cleanErr = (error) => {
    if (error.includes('"value" should'))
      return error.replace('"value" should', "Must");
    else if (error.includes('"value"'))
      return error.replace('"value"', "Value");
    else if (error.includes('"')) return error.replaceAll('"', "");
    return error;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    let result;
    if (name === "password") {
      result = this.validatePassword(value);
    } else {
      const schema = { [name]: this.schema[name] };
      result = Joi.validate(obj, schema);
    }
    const { error } = result;
    return error ? this.cleanErr(error.details[0].message) : null;
  };

  validatePassword = (password) => {
    const complexity = {
      min: 8,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 0,
      requirementCount: 4,
    };
    return passwordJoi(complexity)
      .messages({
        "passwordComplexity.lowercase":
          "Must contain atleast one lowercase value",
        "passwordComplexity.uppercase":
          "Must contain atleast one uppercase value",
        "passwordComplexity.numeric": "Must contain atleast one number",
      })
      .validate(password);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    if (this.state.data.hasOwnProperty("password")) {
      try {
        errors = {
          password: this.validatePassword(this.state.data.password).error
            .details[0].message,
        };
      } catch (err) {}
    }
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    if (this.visited.indexOf(input.name) > -1) {
      const errors = { ...this.state.errors };
      const errorMessage = this.validateProperty(input);
      if (errorMessage) errors[input.name] = errorMessage;
      else delete errors[input.name];
      this.setState({ errors });
    }

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleBlur = ({ currentTarget: input }) => {
    if (this.visited.indexOf(input.name) === -1) this.visited.push(input.name);

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    this.setState({ errors });
    // if (!this.validate()) this.doSubmit();
  };

  renderButton(label) {
    // disabled={this.validate() ? true : false} if i wanted to disable button on invalid inputs but it looks ugly
    return <button>{label}</button>;
  }
  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={data[name]}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        error={errors[name]}
      />
    );
  }
}

export default Form;
