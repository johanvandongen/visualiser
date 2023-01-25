import React from "react";
import { rowStyle, columnStyle } from "./SideMenuGeneric";

export default function GraphGenButtons(props) {

    return (
        <>
            <div style={rowStyle}>
                <button className='button' onClick={props.generate}>Generate Graph</button>
                <button className="button" onClick={props.reset}>reset</button>
            </div>
        </>
        
    )
}