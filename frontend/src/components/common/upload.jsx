import { useState, useEffect } from "react";
import UploadDropZone from "./uploadDropZone";
import { ArrowLeftIcon } from "@heroicons/react/solid"
import { PhotographIcon, DesktopComputerIcon} from "@heroicons/react/outline";


export default ({ onExit, dir }) => {
	const [active, setActive] = useState("collection");

	useEffect(() => {
		document.addEventListener("keydown", detectKeyDown, true);
	});

	const detectKeyDown = (e) => {
		if (e.key === "Escape") onExit();
	};
	
	return (
		
		<div
			className="full-screen overlay-background"
			onClick={(e) => e.target === e.currentTarget && onExit()}
		>
			<div className="overlay upload-overlay">
				<div className="top">
					<button className="exit" onClick={() => onExit()}><ArrowLeftIcon/></button>
					<h3>Choose Profile Picture</h3>
				</div>
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
				<div className="bottom">
					{active === "collection" && "render collection here"}
					{active === "computer" && <UploadDropZone dir={dir} />}
				</div>
			</div>
		</div>
	);
};
