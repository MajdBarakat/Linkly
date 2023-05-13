import React, { useRef, useState } from "react";
import { ChromePicker } from 'react-color';
import outsideClick from "./outsideClick";

export default ({ color, onChangeComplete, onExit }) => {
    
	const [hex, setHex] = useState(color);

	const wrapperRef = useRef(null);
	outsideClick(wrapperRef, onExit)
	
	return (
		<React.Fragment>
			<div className="full-screen overlay"></div>
			<div className="color-picker" ref={wrapperRef}>
				<ChromePicker color={hex} onChange={(c) => setHex(c.hex)} onChangeComplete={onChangeComplete} disableAlpha />
			</div>
		</React.Fragment>
	);
};
