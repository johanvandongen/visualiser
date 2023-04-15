import React, { useState } from "react";
import { rowStyle, columnStyle } from "./SideMenuGeneric";

export default function GraphGenButtons(props) {
    const [width, setWidth] = useState(5)
    const [height, setheight] = useState(5)
    const [connectness, setConnectness] = useState(50)

    const handleWidthSlider = (event) => {
        setWidth(+event.target.value)
    }

    const handleHeightSlider = (event) => {
        setheight(+event.target.value)
    }

    const handleConnectnessSlider = (event) => {
        setConnectness(+event.target.value)
    }

    const generate = () => {
        props.generate(connectness, width, height)
    }

    return (
        <>
            <div style={rowStyle}>
                <button className='button' onClick={generate}>Generate Graph</button>
                <button className="button" onClick={props.reset}>reset</button>
            </div>

            <div style={columnStyle}>
                Width: {width}
                <input type="range" min={2} max={6} value={width} onChange={handleWidthSlider}></input>
                
                Heigth: {height}
                <input type="range" min={2} max={6} value={height} onChange={handleHeightSlider}></input>

                Connectness: {connectness}
                <input type="range" min={0} max={100} value={connectness} onChange={handleConnectnessSlider}></input>
            </div>
        </>
        
    )
}