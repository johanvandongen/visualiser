import React, { useEffect } from "react";
import { useState } from "react";
import '../index.css'
import {ALG} from './SorterVisualisation';

export default function SideMenu(props) {
    const [size, setSize] = useState(50)
    const [speed, setSpeed] = useState({percentage: 80, milliSeconds: 203}) // Absolute hard coded (can also use useEffect for init)

    const rowStyle = {
        position: "relative", 
        width:"100%", 
        display: "flex",
        justifyContent: "flex-start",
        padding: "0.2rem",
    }

    const columnStyle = {
        position: "relative", 
        width:"100%", 
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: 'column',
        padding: "0.2rem",
    }

    const handleSizeSlider = (event) => {
        setSize(event.target.value)
    }

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
                <button className='button' onClick={() => props.generateArray(size)}>Generate array</button>
                <button className="button" onClick={props.reset}>reset</button>
            </div>

            <div style={columnStyle}>
                array size: {size}
                <input type="range" min={5} max={100} value={size} onChange={handleSizeSlider}></input>
            </div>

            <div style={rowStyle}>
                <button className="button" onClick={playPause}>{props.timer ? 'Pause' : 'Play!'}</button>
            </div>

            <div style={columnStyle}>
                speed: {speed.percentage}
                <input type="range" min={1} max={100} value={speed.percentage} onChange={handleSpeedSlider}></input>
            </div>

            <div style={columnStyle}>
                <p>Current selection: <span>{props.alg}</span></p>
                <select onChange={props.switchAlg}>
                    <option value={ALG.INSERTION}>{ALG.INSERTION}</option>
                    <option value={ALG.BUBBLE}>{ALG.BUBBLE}</option>
                    <option value={ALG.MERGE}>{ALG.MERGE}</option>
                </select>
            </div>
        </>
        
    )
}