import React from "react";

export const rowStyle = {
    position: "relative", 
    width:"100%", 
    display: "flex",
    justifyContent: "flex-start",
    padding: "0.2rem",
}

export const columnStyle = {
    position: "relative", 
    width:"100%", 
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: 'column',
    padding: "0.2rem",
}

export default function SideMenu(props) {

    return (
        <>
            {props.children}
        </>
        
    )
}