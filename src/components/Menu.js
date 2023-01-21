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
            <div style={{width: "40%"}}>
                <h1>{props.types[props.currentType].name} Visualiser</h1>
            </div>

            <div id="custom-select">
                <select onChange={props.changeType} value={props.currentType}>
                    <option value={0}>{props.types[0].name}</option>
                    <option value={1}>{props.types[1].name}</option>
                    <option value={2}>{props.types[2].name}</option>
                </select>
            </div>
        </div>
    )
}