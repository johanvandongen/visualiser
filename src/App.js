import { useState, useEffect, useRef } from "react";
import Menu from "./Menu";
import Visualisation from "./Visualisation";
import SideMenu from "./SideMenu"
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from "./colors";
import { randomValue } from "./helpers"
import { InsertionSort } from "./SortingAlgs/InsertionSort";
import { BubbleSort } from "./SortingAlgs/BubbleSort";

export const ALG = {
  INSERTION: 'insertion',
  BUBBLE: 'bubble',
}

function App() {
  const [array, setArray] = useState({values: [], leftElement:0, rightElement:0, step:0, timer: null})
  const [moves, setMoves] = useState([])
  const [alogrithm, setAlgorithm] = useState(ALG.INSERTION)
  const timerIdRef = useRef();

  

  const generateArray = () => {

    setArray((prev) => {
      clearInterval(prev.timer);
      
      let newArray = []
      for (let i =0; i<100; i++) {
        let randValue = randomValue(1,100);
        newArray.push( {id:uuidv4(), val: randValue} );
      }

      return {...prev, values:newArray, step:0, timer:null}}) 
  }

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
  const runSort = () => {

    setArray((prev) => {
      if (prev.timer === null) {
        
        clearInterval(timerIdRef.current)
        const intervalTimer = setInterval(() => runSortAnimation(), 4)
        
        timerIdRef.current = intervalTimer;
        console.log("timer set", intervalTimer)
        return {...prev, timer: intervalTimer}
      }
      return {...prev}
    })
  }

  const pauseVisualisation = () => {
    setArray((prev) => {
      if (prev.timer === null) {
        return {...prev}
      }
      clearInterval(prev.timer)
      return {...prev, timer: null}
    })
  }

  const switchSortingAlgorithm = (event) => {
    console.log("Switched to", event.target.value)

    setArray((prev) => {
      clearInterval(array.timer)
      return {...prev, step:0, timer:null }
    }) 

    setAlgorithm((prev) => {
      return event.target.value
    })

    setMoves((prev) => {
      let sorter;
      if (alogrithm === ALG.INSERTION) {
        sorter = new InsertionSort();
      } else {
        sorter = new BubbleSort();
      }
      return sorter.get_sort_index_steps(array.values)
    })

  }

  // Generate array at beginning of component
  useEffect(() => {
    generateArray()
  }, [])

  // Set new moves
  useEffect(() => { 
    
    if (array.step === 0) {
      setMoves((prev) => {
        let sorter;
        if (alogrithm === ALG.INSERTION) {
          sorter = new InsertionSort();
        } else {
          sorter = new BubbleSort();
        }
        return sorter.get_sort_index_steps(array.values)
      });
    }
  }, [array])

  // Styles ---
  const topMenuStyle = {
    height:"10vh", 
    width:"100%", 
    backgroundColor: COLORS.color2,
    position:"relative", 
    padding:"1rem 1rem"
  }

  const sideMenuStyle = {
    height:"70vh", 
    width:"20%", 
    backgroundColor: COLORS.color3,
    position:"relative",
    padding:"1rem 1rem"
  }

  const visStyle = {
    width:"80%", 
    height: "70vh",
    backgroundColor: COLORS.menuColor,
    position:"relative",
    padding:"1rem 1rem",
  }

  return (
    <>
    
    <div style={topMenuStyle}>
      <Menu generateArray={generateArray} sortArray={runSort}/>
    </div>

    <div style={{display:"flex"}}>

      <div style={visStyle}>
        <Visualisation array={array}/>
      </div>

      <div style={sideMenuStyle}>
        <SideMenu generateArray={generateArray} sortArray={runSort} pause={pauseVisualisation} switchAlg={switchSortingAlgorithm}/>
      </div>
    </div>

    </>
  )
}

export default App;
