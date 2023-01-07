import React from "react";
import { COLORS } from "./colors";
import './index.css'

export default function Visualisation({array}) {

    const containerStyle = {
        display: "flex", 
        flexDirection: "row", 
        width:"100%", 
        height:"100%",
        alignItems:"flex-end", 
        justifyContent:"space-between"
    }

    // Calculate the width of each bar in percentage based on the number of elements
    const gap = 0.2 // Subtract smth from the bar width to introduce a gap
    const width = (100 / array.values.length) - gap;

    return (
        <>
        <div style={containerStyle}>
            {array.values.map((bar, index) => {
                let color = COLORS.color4;
                let className = "fade";

                if (array.leftElement === index) {
                    color = COLORS.visHighlight1;
                }
                if (array.rightElement === index) {
                    color = COLORS.visHighlight2;
                }

                return <div id={bar.id} className={className} key={bar.id} 
                style={{
                    height: `${bar.val}%`, 
                    backgroundColor: color, 
                    width: `${width}%`,
                    }}>
                </div>;
            })}
        </div>
        </>
    )
}