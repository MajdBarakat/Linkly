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
        <div className="full-screen flex column content-center">
            <h1>Thank you for registering!</h1>
            <h2>Please find the validation email sent to you at: <span>{user ? user.email : ""}</span></h2>
            <Link to={"/admin/links"}>Go to Admin</Link>
        </div>
    )
}