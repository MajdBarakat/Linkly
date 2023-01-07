import React, { useState, useEffect } from "react";
import Navbar from "../components/common/navbar";
import Profile from "../components/common/profile";
import getUser from "../components/services/getUser";

export default () => {

  return (
    <React.Fragment>
      <Navbar/>
      <Profile/>
    </React.Fragment>
  );
};
