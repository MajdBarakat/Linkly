import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import http from "../components/services/httpService";
import config from "../config.json";
import ErrorPage from "../components/common/404";

export default () => {
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState("")
    const [theme, setTheme] = useState(null)
    const [background, setBackground] = useState(null)
    const params = useParams()

    useEffect(() => {

        const getUser = async () => {
            const result = await http.get(process.env.REACT_APP_API + `/users/${params.username}`)
                .catch((err) => alert(err.response.data)) 
            
            if (!result) setUser(null)
            else {
                const { isUsingTheme } = result.data.appearance.theme
                setUser(sortLinks(result.data));
                isUsingTheme ?
                    setTheme(result.data.appearance.theme.themeId)
                    :
                    setBackground(result.data.appearance.custom.background.backgroundId)
            }
        }

        user || user === null ? setLoaded(true) : getUser()

    }, [user]);

    const sortLinks = (user) => {
        const data = {...user}
        data.links = data.links.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
        return data
    };

    const renderUserLinks = () => {
        const { linkLayout, layoutId } = user.appearance.layout;
        // const background = linkLayout
        //come back to this when you integrate link layouts in appearance. :)
        return (
            <div className={`links-container${layoutId ? " layout-" + layoutId : ""}${linkLayout ? " link-layout-" + linkLayout : ""}`}>
                {user.links.map((link) => (
                    <a className="link" key={link.id} href={link.linkURL}>
                        <h2 className="link-name">{link.linkName}</h2>
                    </a>
                ))}
            </div>
        )
    }

    const renderStyle = () => {
        const date = new Date
        const { bgdPrimary, bgdSecondary } = user.appearance.custom.colors
        if (theme) {
            return { background: `url(${process.env.REACT_APP_CDN}backgrounds/themes/${theme}.svg?${date.toISOString()})` }
        } else {
            switch (background) {
                case 0:
                    return { background: `${bgdPrimary}` }
                case 1:
                    return { background: `linear-gradient(${bgdPrimary}, ${bgdSecondary})` }
            }
        }
    }

    const renderUserContent = () => { 
        return (
            <div
                className={`background${theme ? " theme-" + theme : ""}`}
                style={renderStyle()}
            >
                <div className="user-container">
                    <div className="profile-pic" style={{background: `url(${user.appearance.profile.profilePicURL})`}}></div>
                    <h2 className="username">@{user.username}</h2>
                    {/* <h3 className="name">{user.appearance.profile.name}</h3>
                    <h3 className="title">{user.appearance.profile.title}</h3>
                    <h3 className="bio">{user.appearance.profile.bio}</h3> */}
                    {renderUserLinks()}
                </div>
            </div>
        )
    };

    return (
        <React.Fragment>
            {!loaded ? <h1>LOADING..</h1> : user === null && <ErrorPage />}
            {loaded && user && renderUserContent()}
    </React.Fragment>
  );
};
