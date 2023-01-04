import React from "react";
import { COLORS } from "./colors"

export default function Menu() {

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
        </div>
    )
}