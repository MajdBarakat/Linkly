import React from "react";
import Navbar from "../components/common/navbar";
import Links from "../components/common/links";

export default () => {
  return (
    <React.Fragment>
      <Navbar active="Links" />
      <Links />
    </React.Fragment>
  );
};
