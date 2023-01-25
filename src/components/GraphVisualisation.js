import React, { useEffect, useRef, useState } from "react";
import {COLORS} from '../colors.js'
import GraphArea from "./GraphArea"
import { visStyle, sideMenuStyle } from "../App.js";
import { BFS } from './graphAlgorithms/BFS'
import { DFS } from './graphAlgorithms/DFS'
import {SideMenuGeneric, PlayPause, AlgSelection, GraphGenButtons} from "../index.js"

// Generate new graph. This function should indicate the edges and node positions
// id, dragable, color will be handled by the graphArea component.
// For now it is hard coded. Randomizer in the future would be better
function generateGraphMatrix(type) {
  
  let nodesPositions;
  let adjMatrix;
  if (type === 1) {
    
    nodesPositions = [
      {x:10, y:15, color: "purple"}, // 1
      {x:30, y:55, color: "white"}, // 2
      {x:10, y:55, color: "white"}, // 3
      {x:30, y:15, color: "white"}, // 4
      {x:30, y:95, color: "white"}, // 5
      {x:90, y:55, color: "white"}, // 6
      {x:50, y:55, color: "white"}, // 7
      {x:50, y:95, color: "white"}, // 8
      {x:70, y:15, color: "white"}, // 9
      {x:70, y:55, color: "white"}, // 10
      {x:90, y:15, color: "white"}, // 11
      {x:10, y:95, color: "white"}, // 11
    ]
    adjMatrix = [
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
      [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
      [0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    ];

  } else {
    nodesPositions = [{x:10, y:50}, {x:50, y:50}, {x:20, y:70}]
    adjMatrix = [
      [0, 1, 1], 
      [1, 0, 0], 
      [1, 0, 0]];
  }
  return [adjMatrix, nodesPositions]
}

export const ALG = {
  BFS: 'bfs',
  DFS: 'dfs',
}

export default function GraphVisualisation() {
  console.log("graphVis rerendered")
  
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const demoRef = useRef();
  
  const [network, setNetwork] = useState({adjMatrix: [], initNodesPositions: [], nodesPositions: [], step:0, start: 0, current: 0, timer: null})
  const [moves, setMoves] = useState([])
  const [alogrithm, setAlgorithm] = useState(ALG.BFS)
  const timerIdRef = useRef();

  // Sorts one step
  const runSortAnimation = () => {
        
    setNetwork((prev) => {

    if (prev.step > moves.length-1) {
        clearInterval(prev.timer)
        return {...prev, timer:null}
    }

    let nodeColors = prev.nodesPositions.map((n, i) => ({...n, color: moves[prev.step].visited.includes(i) ? "red" : "white"}))
    nodeColors[moves[prev.step].current].color = "purple"
    nodeColors[prev.start].color = "green"

    return {
    ...prev, nodesPositions: nodeColors, step: prev.step+1
    }});
}

// due to strict mode setArray runs twice with the same end result cus no modifications, however
// two timers get created and we need to have EXACTLY 1 (otherwise pause will not work).
// Currently uses a useRef to store timer id which we clear on second call, but this seems a bit hacky
// so this might break later on!
// We can also use a global variable instead of useRef I think...
const runSort = (ms) => {

    setNetwork((prev) => {
    clearInterval(timerIdRef.current)
    const intervalTimer = setInterval(() => runSortAnimation(), ms)
    
    timerIdRef.current = intervalTimer;
    console.log("timer set", intervalTimer)
    return {...prev, timer: intervalTimer}
    })
}

const switchAlgorithm = (event) => {

  setNetwork((prev) => {
  clearInterval(network.timer)
  return {...prev, step:0, timer:null }
  }) 

  setAlgorithm(event.target.value);
  console.log("Switched to", event.target.value)
}

// Set new moves
useEffect(() => { 
  setMoves((prev) => {
  let traverser;
  if (alogrithm === ALG.BFS) {
    traverser = new BFS();
  } else if (alogrithm === ALG.DFS) {
    traverser = new DFS();
  }
  console.log("alg", alogrithm)
  return traverser.get_graph_steps(0,1, network.adjMatrix)
  });
}, [network.initNodesPositions, alogrithm])


  // Handles canvas size to fit in the parent div
  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setWidth(event[0].contentBoxSize[0].inlineSize);
      setHeight(event[0].contentBoxSize[0].blockSize);
    });

    if (demoRef) {
      resizeObserver.observe(demoRef.current);
    }
  }, [demoRef]);

  // Generate network graph
  useEffect(() => {
    setNetwork((prev) => {
      let newM = generateGraphMatrix(1);
      return {...prev, adjMatrix: newM[0], initNodesPositions: newM[1],  nodesPositions: newM[1]}
    })
  }, [width, height])

  return (
    <div style={{display: "flex"}}>
      
      <div ref={demoRef} style={visStyle}>
        <GraphArea width={width} height={height} network={network}/>
      </div>
      
      <div style={sideMenuStyle}>
        <SideMenuGeneric>
          <GraphGenButtons generate={generateGraphMatrix} reset={() => console.log("e")}/>
          <PlayPause timer={network.timer} sortArray={runSort} pause={() => console.log("e")}/>
          <AlgSelection algs={ALG} alg={alogrithm} switchAlg={switchAlgorithm}/>
        </SideMenuGeneric>
      </div>
    </div>
  );

}