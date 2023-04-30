import React from "react";
import { rowStyle, columnStyle } from "./SideMenuGeneric";

export default function SideMenu(props) {

    return (
        <>
            <div style={columnStyle}>
                <p>Current selection: <span>{props.alg}</span></p>
                <select onChange={props.switchAlg} defaultValue={props.alg}>
                    {Object.keys(props.algs).map(key => (
                        <option key={key} value={props.algs[key]}>{props.algs[key]} </option>
                        ))}
                </select>
            </div>
        </>
        
    )
}