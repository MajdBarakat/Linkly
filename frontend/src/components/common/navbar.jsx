import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import getUser from "../services/getUser";
import { XIcon } from "@heroicons/react/solid";

export default ({ active }) => {
  const [menuVisibility, setMenuVisibility] = useState(false)
  const [warningVisibility, setWarningVisibility] = useState(true)
  const navigation = [
    { label: "Links", to: "/admin/links"},
    { label: "Appearance", to: "/admin/appearance"},
    // { label: "Settings", to: "/admin/settings"},
  ]

  
  const [user, setUser] = useState('')
  const [fetched, setFetched] = useState(false)
  const jwt = localStorage.getItem('jwt')
  
  useEffect(() => {
    const assignUser = async () => {
      const user = await getUser(jwt) || ""
      setUser(user)
      setFetched(true)
    }
    if (!user) assignUser();
  })
  
  const doLogout = () => {
    localStorage.removeItem('jwt')
    setUser('');
    window.location.href= '/'
  }

  const dropdown =
    <div className="dropdown-menu">
      <div><Link to={`/${user.username}`}><h4>@{user.username}</h4></Link></div>
      <Link to="/profile" className={active === "Profile" ? "active" : ""}>Profile</Link>
      {/* <Link to="/admin/settings" className={active === "Settings" ? "active" : ""}>Settings</Link> */}
      <Link className="logout" onClick={() => doLogout()}>Logout</Link>
    </div>
  
  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="left">
          <div className="logo"></div>{" "}
          <div className="nav-links">
            {navigation.map((e) => (
             <Link key={e.label} className={e.label === active ? "active" : ""} to={e.to}>
                {e.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="right">
          {user && 
            <React.Fragment>
              {menuVisibility && dropdown}
              <div
                className="profile-pic"
                style={{background: `url(${user.appearance.profile.profilePicURL})`}}
                onClick={() => setMenuVisibility(!menuVisibility)}
              ></div>
            </React.Fragment>
          }
          {!user && fetched ?
            <div className="signin-signup">
              <Link to="/login">Sign in</Link>
              <Link to="/register">Sign up</Link>
            </div>
            :
            ""
          }
        </div>
      </div>
      {user && warningVisibility && !user.isVerified ? (
        <div className="verification-warning">
          {
              <h4>
                To publish your profile, please verify your email by clicking the
                link we've sent to your email: {<span>{user.email}</span>}. {<span className="resend" onClick={() => console.log("resend-email here")}> Resend Verification Link</span>}
              </h4>
          }
          <XIcon className="close" onClick={() => setWarningVisibility(false)}>
            X
          </XIcon>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
