import React from "react";
import Appearance from "../components/common/appearance";
import Navbar from "../components/common/navbar";


export default () => {
  return (
    <React.Fragment>
      <Navbar active="Appearance" />
      <Appearance />
    </React.Fragment>
  );
};
