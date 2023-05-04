import { layoutOptions, themeOptions, backgroundOptions } from "../../assets/svgs";

export default ({ index, type }) => {

    const getElement = () => {
        switch (type) {
            case "layout": return layoutOptions[index]
            case "theme": return themeOptions[index]
            case "background": return backgroundOptions[index]
        }
    }
    
    return getElement();
}
 
