import React from "react";
import { COLORS } from "../../utils/colors"
import '../../index.css'
import Dropdown from "./Dropdown";

export default function TopMenu(props) {

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
                <h1>{props.currentType} Visualiser</h1>
            </div>

            <div id="custom-select">
                <Dropdown options={props.types} current={props.currentType} onChange={props.changeType}/>
            </div>
        </div>
    )
}