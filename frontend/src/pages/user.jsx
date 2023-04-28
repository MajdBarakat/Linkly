import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import http from "../components/services/httpService";
import config from "../config.json";


export default () => {
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState("")
    const [theme, setTheme] = useState("")
    const params = useParams()

    useEffect(() => {

        const getUser = async () => {
            const result = await http.get(config.api + `/users/${params.username}`)
                .catch((err) => alert(err.response.data)) 
            
            if (!result) setUser(null)
            else {
                setUser(sortLinks(result.data));
                setTheme(result.data.appearance.theme.isUsingTheme ? result.data.appearance.theme.themeId : null);
            }
        }

        user || user === null ? setLoaded(true) : getUser()

    }, [user]);

    const sortLinks = (user) => {
        const data = {...user}
        data.links = data.links.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
        return data
    };

    const renderUserContent = () => { 
        return user.links.map((link) => (
            <a key={link.id} href={link.linkURL}>
                <h1>{link.linkName}</h1>
            </a>
        ))
    };
    
    const renderTheme = () => {
        
    }


    return (
        <React.Fragment>
            {!loaded ? <h1>LOADING..</h1> : user === null && <h1>User Not Found</h1>}
            {loaded && user && !theme &&
                <div className="background">
                    <div className="user-container">
                        <div className="profile-pic" style={{background: `url(${user.appearance.profile.profilePicURL})`}}></div>
                        <h2>@{user.username}</h2>
                        {/* <h3>{user.appearance.profile.name}</h3>
                        <h3>{user.appearance.profile.title}</h3>
                        <h3>{user.appearance.profile.bio}</h3> */}
                        {/* page content here */}
                        {renderUserContent()}
                    </div>
                </div>}
            {loaded && user && !user.appearance.theme.isUsingTheme }
    </React.Fragment>
  );
};
