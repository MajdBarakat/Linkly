import { Link } from "react-router-dom"
import getUser from "../components/services/getUser"
import { useEffect, useState } from "react"
const jwt = localStorage.getItem('jwt')

export default () => {
    const [user, setUser] = useState()

    useEffect(() => {
        const assignUser = async () => {
          const user = await getUser(jwt) || ""
          setUser(user)
        }
        if (!user) assignUser();

        if(user && user.isVerified) window.location.href= '/profile'
      },[])

  return (
      <div className="full-screen flex column content-center gradient">
              <h1 className="hero-subtitle">Thank you for <br/> registering!</h1>
              <h1 className="sub-hero medium">We have sent a verification email to:<br /> <span>{user ? user.email : ""}</span></h1>
              <div className="button-container flex content-center">
                <Link to={"/admin/links"} className="admin w100"><button className="w100">Go To Admin</button></Link>
              </div>
          </div>
    )
}