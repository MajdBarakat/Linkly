import React from "react";
import Navbar from "../components/common/navbar";
import Profile from "../components/common/profile";

export default () => {
  return (
    <React.Fragment>
      <Navbar
        navigation={[
          { label: "Links", to: "/admin/links", active: undefined },
          { label: "Appearance", to: "/admin/appearance", active: undefined },
          { label: "Settings", to: "/admin/settings", active: undefined },
        ]}
      />
      <Profile />
    </React.Fragment>
  );
};
