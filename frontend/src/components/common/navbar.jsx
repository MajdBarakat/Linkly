import React from "react";
import link from "./link";

export default ({ navigation, user, dropDown }) => {
  let menuVisibility = false;
  let warningVisibility = true;
  return (
    <React.Fragment>
      <div className="navbar">
        <div className="left">
          <div className="logo"></div>{" "}
          <ul className="nav-links">
            {navigation.map((e) => (
              <li className={e.active}>
                <a href={e.href}>{e.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="right">
          {user ? (
            <div
              className="userIcon"
              style={`background: url(${user.appearance.profile.profilePicURL})`}
              onClick={() => (menuVisibility = !menuVisibility)}
            >
              {menuVisibility}
            </div>
          ) : (
            <div className="signin-signup">
              <a href="">Sign in</a>
              <a href="">Sign up</a>
            </div>
          )}
        </div>
      </div>
      {user.isVerified && warningVisibility ? (
        ""
      ) : (
        <div className="verification-warning">
          {
            <p>
              `To publish your profile, please verify your email by clicking the
              link we sent to ${<span>{user.email}</span>}. $
              {<a href="">Resend Verification Link</a>}`
            </p>
          }
          <button className="close" onClick={() => (warningVisibility = false)}>
            X
          </button>
        </div>
      )}
    </React.Fragment>
  );
};
