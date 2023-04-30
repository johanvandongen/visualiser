import { useState, useEffect } from "react";
import SortBars from "./SortBars";
import { v4 as uuidv4 } from 'uuid';
import { randomValue } from "../utils/helpers"
import { InsertionSort } from "../algorithms/sortingAlgs/InsertionSort";
import { BubbleSort } from "../algorithms/sortingAlgs/BubbleSort";
import { CocktailSort } from "../algorithms/sortingAlgs/CocktailSort";
import { InPlaceMergeSort } from "../algorithms/sortingAlgs/InPlaceMergeSort";
import { visStyle, sideMenuStyle } from "../App";
import {SideMenuGeneric, PlayPause, AlgSelection, SorterGenButtons} from "../index.js"
import { usePlayPause } from "../hooks/usePlayPause";

export const ALG = {
    INSERTION: 'insertion',
    BUBBLE: 'bubble',
    MERGE: 'merge',
    COCKTAIL: 'cocktail'
}

export default function SorterVisualisation() {
    const [array, setArray] = useState({initValues: [], values: [], leftElement:-1, rightElement:-1, reset: 0})
    const [alogrithm, setAlgorithm] = useState(ALG.MERGE)
    const [steps, setSteps] = useState()
    const [isPlaying, setIsPlaying] = useState({playing: false, finished: false, delay:203})

    usePlayPause(() => {
      let nextStep = steps.next()
      if (nextStep.done === true) {
        setIsPlaying({playing: false, finished: true})
      } else {
        setArray((prev) => {
            return {...prev, 
                values:nextStep.value.array, 
                leftElement:nextStep.value.indices[0], 
                rightElement:nextStep.value.indices[1]
            }})
      }}, isPlaying.playing ? isPlaying.delay : null
    )

    // Generate a new array
    const generateArray = (arraySize) => {
        setIsPlaying((prev) => {return {...prev, playing:false, finished: false}})

        setArray((prev) => {
            let newArray = []
            for (let i =0; i<arraySize; i++) {
                let randValue = randomValue(1,100);
                newArray.push( {id:uuidv4(), val: randValue} );
            }
            return {...prev, initValues: newArray, values:newArray, reset:prev.reset + 1}
        }) 
    }

    // TODO after reset, set new moves
    const resetArray = () => {
        setIsPlaying((prev) => {return {...prev, playing:false, finished: false}})

        setArray((prev) => {
            // we copy the initValues array with new id's. This way the initValues gets 'changed' (cuz of id)
            // As a positive side effect the bars fade in again because of the id change.
            let newArray = []
            for (let i =0; i<prev.initValues.length; i++) {
                if (prev.values[i].val !== prev.initValues[i].val) {
                    newArray.push( {id:uuidv4(), val: prev.initValues[i].val} );
                } else {
                    newArray.push( {id: prev.initValues[i].id, val: prev.initValues[i].val} );
                }
            }
            return {...prev, initValues: newArray, values:newArray, reset:prev.reset+1}
        })
    }

    const runSort = (ms) => {
        setIsPlaying((prev) => {return {...prev, playing:true, delay: ms}})
    }

    const pauseVisualisation = () => {
        setIsPlaying((prev) => {return {...prev, playing:false}})
    }

    const switchSortingAlgorithm = (event) => {
        setIsPlaying((prev) => {return {...prev, playing:false, finished: false}}) 
        setAlgorithm(event.target.value);
    }

    // Generate array at beginning of component
    useEffect(() => {
        generateArray(50)
    }, [])

    // Set new moves
    useEffect(() => { 
        setSteps((prev) => {
            let sorter;
            if (alogrithm === ALG.INSERTION) {
                sorter = new InsertionSort();
            } else if (alogrithm === ALG.BUBBLE) {
                sorter = new BubbleSort();
            } else if (alogrithm === ALG.COCKTAIL) {
                sorter = new CocktailSort();
            } else {
                sorter = new InPlaceMergeSort();
            }
            return sorter.stepGenerator(array.values)
        });
    }, [alogrithm, array.reset])

    return (
    <>
        <div style={{display:"flex"}}>
            
            <div style={visStyle}>
                <SortBars array={array}/>
            </div>

            <div style={sideMenuStyle}>
                
                <SideMenuGeneric>
                    <SorterGenButtons generate={generateArray} reset={resetArray}/>
                    <PlayPause isPlaying={isPlaying.playing} runVis={runSort} pause={pauseVisualisation}/>
                    <AlgSelection algs={ALG} alg={alogrithm} switchAlg={switchSortingAlgorithm}/>
                </SideMenuGeneric>
            </div>
        </div>
    </>
  )
}