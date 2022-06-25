import React from "react";
import Navbar from "../components/common/navbar";
import Links from "../components/common/links";

export default () => {
  return (
    <React.Fragment>
      <Navbar
        navigation={[
          { label: "Links", to: "/admin/links", active: "active" },
          { label: "Appearance", to: "/admin/appearance", active: undefined },
          { label: "Settings", to: "/admin/settings", active: undefined },
        ]}
      />
      <Links />
    </React.Fragment>
  );
};
