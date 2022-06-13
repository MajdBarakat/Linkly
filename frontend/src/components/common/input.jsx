import React, { Component } from "react";

export default ({ name, label, value, onChange, onBlur, error }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type="text"
      ></input>
      {error && <div>{error}</div>}
    </div>
    //if error is truthy returns the div of errors
  );
};
