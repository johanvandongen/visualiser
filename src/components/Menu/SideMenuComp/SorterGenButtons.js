import React from "react";
import { useState } from "react";
import { rowStyle, columnStyle } from "./SideMenuGeneric";

export default function SorterGenButtons(props) {
    const [size, setSize] = useState(50)

    const handleSizeSlider = (event) => {
        setSize(event.target.value)
    }

    return (
        <>
            <div style={rowStyle}>
                <button className='button' onClick={() => props.generate(size)}>Generate array</button>
                <button className="button" onClick={props.reset}>reset</button>
            </div>

            <div style={columnStyle}>
                array size: {size}
                <input type="range" min={5} max={100} value={size} onChange={handleSizeSlider}></input>
            </div>
        </>
        
    )
}