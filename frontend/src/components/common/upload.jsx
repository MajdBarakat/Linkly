import React, { useState, useEffect, useRef } from "react";
import UploadDropZone from "./uploadDropZone";
import { ArrowLeftIcon } from "@heroicons/react/solid"
import { PhotographIcon, DesktopComputerIcon} from "@heroicons/react/outline";
import http from "../services/httpService";
import config from "../../config.json"
import outsideClick from "./outsideClick";

export default ({ onExit, dir, link, hasOptions = "true" , initialActive = "collection" }) => {
	const [active, setActive] = useState(initialActive);
	const [collection, setCollection] = useState([]);
	const [choice, setChoice] = useState("");

	useEffect(() => {
		document.addEventListener("keydown", detectKeyDown, true);
		getCollection(dir);
	},[choice]);

	const detectKeyDown = (e) => {
		if (e.key === "Escape") {
			document.body.style.overflow = 'unset';
			onExit()
		};
	};
	
	const getCollection = async (dir) => {
		const result = await http
			.get(
				process.env.REACT_APP_API + `/image/list?dir=${dir}/default`
		).catch(err => alert(err.response.data))
		if (!result) return;
		result.data.shift()
		setCollection(result.data)
	}

	const doSubmit = async () => {
		delete link.isEditing;
		const jwt = localStorage.getItem('jwt')
		link[dir + "URL"] = choice + "?" + new Date().toISOString();
      
		const result = await http
			.put(process.env.REACT_APP_API + "/links/edit", link,
			{ headers: { "x-auth-token": jwt } }
			)
			.catch((err) => alert(err.response.data));
		if (!result) return;
		setChoice("");
		document.body.style.overflow = 'unset';
		onExit();
	}

	const wrapperRef = useRef(null);
	outsideClick(wrapperRef, onExit)

	if (typeof window != 'undefined' && window.document) {
		document.body.style.overflow = 'hidden';
	}
	
	return (
		<div
			className="full-screen overlay-background"
		>
			<div className="modal upload-modal" ref={wrapperRef}>
				<div className="top">
					<button className="exit" onClick={() => onExit()}><ArrowLeftIcon/></button>
					<h3>{`Choose ${dir.charAt(0).toUpperCase() + dir.slice(1)} Picture`}</h3>
				</div>
				{hasOptions && 
					<div className="options">
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
				}
				<div className="bottom">
					{active === "collection" && collection ?
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
									onClick={() => setChoice(process.env.REACT_APP_CDN + img)}
									style={{"background": `url(${process.env.REACT_APP_CDN + img})`}}
								/>
								)
							}
						</section>
						:
						active === "collection" && "Loading..."
					}
					{active === "computer" && <UploadDropZone dir={dir} link={link} />}
				</div>
			</div>
		</div>
	);
};
