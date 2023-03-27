import React from "react";
import { layouts, themes, backgrounds } from "../../assets/svgs";

export default ({ index, type }) => {

    const getElement = () => {
        switch (type) {
            case "layout": return layouts[index]
            case "theme": return themes[index]
            case "background": return backgrounds[index]
        }
    }
    
    return getElement();
}
 
