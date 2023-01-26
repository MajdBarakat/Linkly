import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import http from "../components/services/httpService";
import config from "../config.json";


export default () => {
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState("")
    const params = useParams()

    useEffect(() => {

        const getUser = async () => {
            const result = await http.get(config.api + `/users/${params.username}`)
                .catch((err) => alert(err.response.data)) 
            
            if (!result) setUser(null)
            else setUser(sortLinks(result.data))
        }

        user || user === null ? setLoaded(true) : getUser()

    }, [user]);

    const sortLinks = (user) => {
        const data = {...user}
        data.links = data.links.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
        return data
    };

    const renderUserContent = () => { 
        return user.links.map((link) => (<h1>{link.linkName}</h1>))
     };


    return (
        <React.Fragment>
            {!loaded ? <h1>LOADING..</h1> : user === null && <h1>User Not Found</h1>}
            {loaded && user && 
                <div>
                    <h1>USER PAGE</h1>
                    <h2>{user.username}</h2>
                    {/* page content here */}
                    {renderUserContent()}
                </div>
            }
    </React.Fragment>
  );
};
