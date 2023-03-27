import { useEffect, useState } from "react";
import { ChromePicker } from 'react-color';

export default ({ color, onChangeComplete, onExit }) => {
    
    const [hex, setHex] = useState(color);

	useEffect(() => {
		document.addEventListener("keydown", detectKeyDown, true);
	});

	const detectKeyDown = (e) => {
		if (e.key === "Escape") onExit();
	};
	
	return (
		<div className="color-picker">
			<ChromePicker color={hex} onChange={(c) => setHex(c.hex)} onChangeComplete={onChangeComplete} disableAlpha />
		</div>
	);
};
