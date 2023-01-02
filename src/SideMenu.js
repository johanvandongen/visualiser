import React from "react";
import './index.css'
import {ALG} from './App';

export default function SideMenu(props) {
    const menuStyle = {
        position: "relative", 
        width:"100%", 
        display: "flex",
        justifyContent: "flex-start"

    }
    // const buttonStyle = {
    //     backgroundColor: isHovering ? 'white' : 'black',
    //     borderRadius: '1em',
    //     padding: '1em',
    //     border: 'none',
    //     marginRight: '1em',
    // }

    return (
        <>
            <div style={menuStyle}>
                <button className='button' onClick={props.generateArray}>Generate array</button>
                <button className="button" onClick={props.sortArray}>Sort!</button>
                <button className="button" onClick={props.pause}>Pause</button>
            </div>

            <div>
                <p>Current selection: ...</p>
                <select onChange={props.switchAlg}>
                    <option value={ALG.INSERTION}>{ALG.INSERTION}</option>
                    <option value={ALG.BUBBLE}>{ALG.BUBBLE}</option>
                </select>
            </div>
        </>
        
    )
}