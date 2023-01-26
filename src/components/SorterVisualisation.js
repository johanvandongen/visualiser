import { useState, useEffect, useRef } from "react";
import SortBars from "./SortBars";
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from "../colors";
import { randomValue } from "../helpers"
import { InsertionSort } from "../sortingAlgs/InsertionSort";
import { BubbleSort } from "../sortingAlgs/BubbleSort";
import { InPlaceMergeSort } from "../sortingAlgs/InPlaceMergeSort";
import { visStyle, sideMenuStyle } from "../App";
import {SideMenuGeneric, PlayPause, AlgSelection, SorterGenButtons} from "../index.js"

export const ALG = {
    INSERTION: 'insertion',
    BUBBLE: 'bubble',
    MERGE: 'merge'
}

export default function SorterVisualisation() {
    const [array, setArray] = useState({initValues: [], values: [], leftElement:-1, rightElement:-1, step:0, timer: null})
    const [moves, setMoves] = useState([])
    const [alogrithm, setAlgorithm] = useState(ALG.INSERTION)
    const timerIdRef = useRef();

    // Generate a new array
    const generateArray = (arraySize) => {

        setArray((prev) => {
        clearInterval(prev.timer);
        
        let newArray = []
        for (let i =0; i<arraySize; i++) {
            let randValue = randomValue(1,100);
            newArray.push( {id:uuidv4(), val: randValue} );
        }

        return {...prev, initValues: newArray, values:newArray, step:0, timer:null}}) 
    }

    // TODO after reset, set new moves
    const resetArray = () => {
        setArray((prev) => {
        clearInterval(prev.timer);

        // This is kinda hacky, but instead of just setting the values to initValues
        // we copy the initValues array with new id's. This way the initValues gets 'changed' (cuz of id)
        // and thus the useEffect for generating the new steps gets triggerd (which is why we do this).
        // As a positive side effect the bars fade in again because of the id change.
        let newArray = []
        for (let i =0; i<prev.initValues.length; i++) {
            if (prev.values[i].val !== prev.initValues[i].val) {
            newArray.push( {id:uuidv4(), val: prev.initValues[i].val} );
            } else {
            newArray.push( {id: prev.initValues[i].id, val: prev.initValues[i].val} );
            }
        }

        return {...prev, initValues: newArray, values:newArray, step:0, timer:null}
        })
    }

    // Sorts one step
    const runSortAnimation = () => {
        
        setArray((prev) => {

        if (prev.step > moves.length-1) {
            clearInterval(prev.timer)
            return {...prev, timer:null}
        }

        // Cant use spread, because we need a deepcopy (values contains objects as elements)
        let temp = JSON.parse(JSON.stringify(prev.values))

        let i = moves[prev.step].indices[0]
        let j = moves[prev.step].indices[1]

        if (moves[prev.step].type === "SWAP") {
            let temp1 = temp[i].val
            temp[i].val = temp[j].val
            temp[j].val = temp1
        }

        return {
        ...prev, values:[...temp], leftElement:j, rightElement:i, step: prev.step+1
        }});
    }

    // due to strict mode setArray runs twice with the same end result cus no modifications, however
    // two timers get created and we need to have EXACTLY 1 (otherwise pause will not work).
    // Currently uses a useRef to store timer id which we clear on second call, but this seems a bit hacky
    // so this might break later on!
    // We can also use a global variable instead of useRef I think...
    const runSort = (ms) => {

        setArray((prev) => {
        clearInterval(timerIdRef.current)
        const intervalTimer = setInterval(() => runSortAnimation(), ms)
        
        timerIdRef.current = intervalTimer;
        console.log("timer set", intervalTimer)
        return {...prev, timer: intervalTimer}
        })
    }

    // Clear timer and update the state
    const pauseVisualisation = () => {
        setArray((prev) => {
        clearInterval(prev.timer) // Works even if prev.timer is null
        return {...prev, timer: null}
        })
    }

    // Stop the timer and set the new alg
    const switchSortingAlgorithm = (event) => {

        setArray((prev) => {
        clearInterval(array.timer)
        return {...prev, step:0, timer:null }
        }) 

        setAlgorithm(event.target.value);
        console.log("Switched to", event.target.value)
    }

    // Generate array at beginning of component
    useEffect(() => {
        generateArray(50)
    }, [])

    // Set new moves
    useEffect(() => { 
        setMoves((prev) => {
        let sorter;
        if (alogrithm === ALG.INSERTION) {
            sorter = new InsertionSort();
        } else if (alogrithm === ALG.BUBBLE) {
            sorter = new BubbleSort();
        } else {
            sorter = new InPlaceMergeSort();
        }
        return sorter.get_sort_index_steps(array.values)
        });
    }, [array.initValues, alogrithm])

    return (
    <>
        <div style={{display:"flex"}}>
            
            <div style={visStyle}>
                <SortBars array={array}/>
            </div>

            <div style={sideMenuStyle}>
                
                <SideMenuGeneric>
                    <SorterGenButtons generate={generateArray} reset={resetArray}/>
                    <PlayPause timer={array.timer} runVis={runSort} pause={pauseVisualisation}/>
                    <AlgSelection algs={ALG} alg={alogrithm} switchAlg={switchSortingAlgorithm}/>
                </SideMenuGeneric>
            </div>
        </div>
    </>
  )
}