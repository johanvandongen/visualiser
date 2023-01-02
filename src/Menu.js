import React from "react";

export default function Menu(props) {

    function test() {
        console.log("test")
    }

    const menuStyle = {
        position: "relative", 
        width:"100%", 
        height: "100%",
        display: "flex",
        justifyContent: "flex-start"

    }
    const buttonStyle = {
        
    }

    return (
        <div style={menuStyle}>
            <button style={buttonStyle} onClick={props.generateArray}>depr</button>
            <button onClick={props.sortArray}> depr! </button>
        </div>
    )
}