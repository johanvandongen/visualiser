import React, { useEffect } from "react";
import { useState } from "react";
import { rowStyle, columnStyle } from "./SideMenuGeneric";

export default function SideMenu(props) {
    const [speed, setSpeed] = useState({percentage: 80, milliSeconds: 203}) // Absolute hard coded (can also use useEffect for init)

    // map 1%- 100%
    // to 1000ms - 4ms
    const handleSpeedSlider = (event) => {
        const value = event.target.value
        const range = 1000 - 4
        const new_speed = Math.round(1000 - (range * (value / 100)))
        setSpeed({percentage: value, milliSeconds: new_speed})
    }

    // Play / Pause button
    const playPause = () => {
        if (props.timer !== null) {
            props.pause();
        } else {
            props.sortArray(speed.milliSeconds)
        }
    }

    useEffect(() => {
        if (props.timer !== null) {
            props.sortArray(speed.milliSeconds)
        }
    }, [speed])

    return (
        <>
            <div style={rowStyle}>
                <button className="button" onClick={playPause}>{props.timer ? 'Pause' : 'Play!'}</button>
            </div>

            <div style={columnStyle}>
                speed: {speed.percentage}
                <input type="range" min={1} max={100} value={speed.percentage} onChange={handleSpeedSlider}></input>
            </div>
        </>
        
    )
}