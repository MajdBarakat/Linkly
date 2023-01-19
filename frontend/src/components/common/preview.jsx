import { useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { PhonePreview, DesktopPreview } from '../../assets/svgs';

export default ({ viewType }) => {

    const vw = window.innerWidth / 100
    const vh = window.innerHeight / 100
    const [dragging, setDragging] = useState(false)
    const [navbar, setNavBar] = useState(null)
    

    useEffect(() => {
        const navbarDoc = document.querySelector(".navbar-container");
        if (navbar !== navbarDoc) setNavBar(navbarDoc);
    })

    
    return (
        viewType === "Desktop" ?
            <ResizableBox className="resizable-vertical"
                width={"none"}
                height={vh* 40}
                minConstraints={[null, vh * 40 ]}
                maxConstraints={[null, vh * 60]}
                resizeHandles={["n"]}
                axis="y"
                handle={<div className={"handle-vertical " +  (dragging ? "dragging" : "") }></div>}
                onResizeStart={() => setDragging(true)}
                onResizeStop={() => setDragging(false)}
            >
                <div className="desktop-preview">
                    <div className="desktop-wrapper">
                        <div className="desktop">
                            <DesktopPreview/>
                        </div>
                    </div>
                </div>
            </ResizableBox>
            :
            <ResizableBox className="resizable-horizontal"
                width={vw * 35}
                height={"none"}
                minConstraints={[vw * 25, null]}
                maxConstraints={[vw * 40, null]}
                resizeHandles={["w"]}
                axis="x"
                handle={<div className={"handle-horizontal " +  (dragging ? "dragging" : "") }></div>}
                onResizeStart={() => setDragging(true)}
                onResizeStop={() => setDragging(false)}
            >
                <div className="mobile-preview">
                    <div className="mobile-wrapper"
                        style={navbar && {
                            "top": `${navbar.clientHeight}px`,
                            "height":`calc(100vh - ${navbar.clientHeight}px)`
                        }}>
                        <div className="mobile">
                            <div className="screen">
                                
                            </div>
                            <PhonePreview />
                        </div>
                    </div>
                </div>
            </ResizableBox>
    );
  };