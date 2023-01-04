import React from "react";
import { useState } from "react";
import './index.css'
import {ALG} from './App';

export default function SideMenu(props) {
    // const [speed, setSpeed] = useState(100)

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

    return (
        <>
            <div style={rowStyle}>
                <button className='button' onClick={() => props.generateArray(50)}>Generate array</button>
                <button className="button" onClick={props.reset}>reset</button>
            </div>

            <div style={rowStyle}>
                <button className="button" onClick={props.sortArray}>Sort!</button>
                <button className="button" onClick={props.pause}>Pause</button>
            </div>

            <div style={columnStyle}>
                <p>Current selection: {props.alg}</p>
                <select onChange={props.switchAlg}>
                    <option value={ALG.INSERTION}>{ALG.INSERTION}</option>
                    <option value={ALG.BUBBLE}>{ALG.BUBBLE}</option>
                </select>
            </div>
        </>
        
    )
}