import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid"
import http from "../services/httpService";
import config from "../../config.json"
import Input from "./input";

export default ({ onExit }) => {
    const [ name, setName ] = useState("")

	useEffect(() => {
		document.addEventListener("keydown", detectKeyDown, true);
	},[]);

	const detectKeyDown = (e) => {
		if (e.key === "Escape") onExit();
    };
    
    const handleChange = ({ currentTarget: input }) => {
        setName(input.value)
    }

    const doSubmit = async (e) => {
        e.preventDefault();

        const jwt = localStorage.getItem('jwt');
        
		const result = await http
			.post(process.env.REACT_APP_API + "/links/new", { name: name },
			{ headers: { "x-auth-token": jwt } }
			)
			.catch((err) => alert(err.response.data));
        if (!result) return;

        setName("");
        
		onExit();
	}
	
	return (
		<div
			className="full-screen overlay-background"
			onClick={(e) => e.target === e.currentTarget && onExit()}
		>
			<div className="modal upload-modal">
                <div className="top">
					<button className="exit" onClick={() => onExit()}><ArrowLeftIcon/></button>
					<h3>Add a new Link</h3>
                </div>
                <form className="bottom">
                    <Input
                        label="Link Name"
                        type="text"
                        onChange={(e) => handleChange(e)}
                        value={name}
                        />
					<button className="add-link" onClick={(e) => doSubmit(e)}>Add new link</button>
				</form>
				{/* <div className="options">
					<button
						className={`collection${
							active === "collection" ? " active" : ""
						}`}
						onClick={() => setActive("collection")}
          >
            <PhotographIcon/>
						Browse collection
					</button>
					<button
						className={`computer${
							active === "computer" ? " active" : ""
						}`}
						onClick={() => setActive("computer")}
          >
            <DesktopComputerIcon/>
						From computer
					</button>
				</div>
				<div className="bottom">
                    <section className={"collection-container" + (choice ? " no-scroll" : "")}>
                        {choice ? 
                            <React.Fragment>
                                <div className="choice-container">
                                    <div className="choice" style={{ "background": `url(${choice})` }} />
                                </div>
                                <button onClick={() => doSubmit()}
                                >Save and Upload Image</button>
                            </React.Fragment>
                            : 
                            collection.map((img, index) =>
                            <div
                                key={index}
                                className="collection-item"
                                onClick={() => setChoice(config.cdn + img)}
                                style={{"background": `url(${config.cdn + img})`}}
                            />
                            )
                        }
                    </section>
				</div> */}
			</div>
		</div>
	);
};
