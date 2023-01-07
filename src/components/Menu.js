import React from "react";
import { COLORS } from "../colors"
import '../index.css'

export default function Menu(props) {

    const menuStyle = {
        position: "relative", 
        width:"100%", 
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        color: COLORS.color5,
    }

    return (
        <div style={menuStyle}>
            <h1>Sorting Visualiser</h1>

            <div id="custom-select">
                <select onChange={props.changeType}>
                    <option value={0}>Sorter</option>
                    <option value={1}>Konva</option>
                </select>
            </div>
        </div>
    )
}