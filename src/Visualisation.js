import React, { useEffect } from "react";
import { COLORS } from "./colors";
import { arraysAreEqual, randomValue } from "./helpers";
import './index.css'

export default function Visualisation({array}) {

    const testAlgorithm = (algorithm) => {
        let numberOfTests = 1000;
        let randValue = randomValue(0,100)

        for (let k=0; k < numberOfTests; k++) {
            
            let randomArray = []
            for (let i=0; i < randValue; i++) {
                randomArray.push(randomValue(1,20));
            }
            let randomArraySortedByAlg = algorithm([...randomArray])
            randomArray.sort((a,b) => {return a-b});

            console.log(randomArraySortedByAlg);
            console.log(randomArray);
            console.log(arraysAreEqual(randomArray, randomArraySortedByAlg));
        }

    }

    const runSortAnimation = (MOVES) => {
        for (let i=0; i < MOVES.length; i++) {
            console.log(MOVES[i])
            document.getElementById(array[10].id).style.backgroundColor = "red";
        }

    }
    
    useEffect(() => {
        //runSortAnimation(insertionSort(array));
        //testAlgorithm(insertionSort);
    }, [])

    const containerStyle = {
        display: "flex", 
        flexDirection: "row", 
        width:"100%", 
        height:"100%",
        alignItems:"flex-end", 
        justifyContent:"space-between"
    }
    const containerStyle1 = {
        position: "relative", 
        width:"100%", 
        height:"100%",
    }

    const barStyle1 = {
        // height:bar.val+"%", 
        backgroundColor:COLORS.color4, 
        width:"1%"
    }

    const width = 100 / array.values.length - 0.2;

    return (
        <>
        <div style={containerStyle}>
            {array.values.map((bar, index) => {
                let color = COLORS.color4;
                let className = "niks";
                if (array.leftElement === index) {
                    color = "red";
                }
                if (array.rightElement === index) {
                    color = "green";
                }
            return <div id={bar.id} className={className} key={bar.id} style={{
                height:bar.val+"%", 
                backgroundColor:color, 
                width:width+'%'}}>
                </div>;
            })}
        </div>
        </>
    )
}