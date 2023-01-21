import { useEffect, useState } from "react";
import { ChromePicker } from 'react-color';

export default ({ color, name, onChangeComplete, onExit }) => {
    
    const [hex, setHex] = useState(color);

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
            <div className="overlay color-overlay">
                <div className="color-name"><h2>{name}</h2></div>
                <ChromePicker color={hex} onChange={(c) => setHex(c.hex)} onChangeComplete={onChangeComplete} disableAlpha />
                <h2>{hex}</h2>
                <button onClick={() => onExit()}>Close</button>
			</div>
		</div>
	);
};
