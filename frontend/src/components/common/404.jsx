import { Link } from "react-router-dom"

export default () => {
    
	return (
		<div className="full-screen flex column content-center gradient">
            <h1 className="hero-subtitle">404 error</h1>
            <h1 className="sub-hero">Oops!<br /> User or Page not found.</h1>
            <div className="button-container flex content-center">
                <Link to={"/admin/appearance"} className="admin w100"><button className="w100">Go To Admin</button></Link>
            </div>
        </div>
	);
};
