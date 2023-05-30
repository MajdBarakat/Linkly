import React from "react"
import { Link } from "react-router-dom"

const jwt = localStorage.getItem('jwt')

export default () => {
    return (
        <div className="full-screen flex column content-center gradient">
            <h1 className="hero-title">LINKLY</h1>
            <h1 className="sub-hero">All your links in a <br /> single click.</h1>
            <div className="button-container flex content-center">
                {jwt ?
                    <Link to={"/admin/links"} className="admin w100"><button className="w100">Go To Admin</button></Link>
                    :
                    <React.Fragment>
                        <Link to={"/login"} className="w50"><button className="sign-in w100">Sign In</button></Link>
                        <Link to={"/register"} className="w50"><button className="register w100">Join Us</button></Link>
                    </React.Fragment>
                }
            </div>
        </div>
    )
}