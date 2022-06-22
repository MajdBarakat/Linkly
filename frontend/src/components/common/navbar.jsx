import React from "react";
import { Link } from "react-router-dom";

export default ({ navigation, user, dropDown }) => {
  let menuVisibility = false;
  let warningVisibility = true;
  return (
    <React.Fragment>
      <div className="navbar">
        <div className="left">
          <div className="logo"></div>{" "}
          <div className="nav-links">
            {navigation.map((e) => (
              <Link key={e.label} className={e.active} to={e.to}>
                {e.label}
              </Link>
            ))}
          </div>
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
              <Link to="/login">Sign in</Link>
              <Link to="/register">Sign up</Link>
            </div>
          )}
        </div>
      </div>
      {user && warningVisibility && user.isVerified ? (
        <div className="verification-warning">
          {
            <p>
              `To publish your profile, please verify your email by clicking the
              link we sent to ${<span>{user.email}</span>}. $
              {<Link to="">Resend Verification Link</Link>}`
            </p>
          }
          <button className="close" onClick={() => (warningVisibility = false)}>
            X
          </button>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
