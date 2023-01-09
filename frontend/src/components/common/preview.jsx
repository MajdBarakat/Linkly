import { useRef, useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';

export default ({ viewType }) => {

    useEffect(() => {

    })

    return (
        viewType === "Desktop" ?
            <ResizableBox className="resizable" width={"none"} height={200} resizeHandles={["n"]} axis="y" handle={<div className="handle-vertical">DRAG ME</div>}>
                <div className="desktop-preview">
                    <div className="desktop">
                        <div className="toolbar">
                            <div className="left"></div>
                            <div className="searchbar"></div>
                            <div className="right"></div>
                        </div>
                        <div className="content">
                            //html here
                        </div>
                    </div>
                </div>
            </ResizableBox>
            :
            <ResizableBox className="resizable-horizontal" width={200} height={"none"} resizeHandles={["w"]} axis="x" handle={<div className="handle-horizontal">DRAG ME</div>}>
                <div className="mobile-preview">
                    <div className="mobile">
                        <div className="border1">
                            <div className="border2">
                                <div className="screen">
                                    <div className="bezel">
                                        <div className="speaker"></div>
                                        <div className="camera"></div>
                                    </div>
                                    <div className="content">
                                        //html here
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </ResizableBox>
    );
  };