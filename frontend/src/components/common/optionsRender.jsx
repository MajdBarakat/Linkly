import React from "react";
import { layouts, themes } from "../../assets/svgs";

export default ({ index, type }) => {

    const getElement = () => {
        switch (type) {
            case "layout": return layouts[index]
            case "theme": return themes[index]
        }
    }
    
    return getElement();
}
 
