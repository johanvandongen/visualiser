import React, { useEffect, useReducer, useRef, useState } from "react";
import {COLORS} from '../colors.js'
import GraphArea from "./GraphArea"
import GraphArea2 from "./GraphArea2"
import { visStyle, sideMenuStyle } from "../App.js";
import { BFS } from '../graphAlgs/BFS'
import { DFS } from '../graphAlgs/DFS'
import { randomValue, shuffleArray } from '../helpers.js'
import {SideMenuGeneric, PlayPause, AlgSelection, GraphGenButtons} from "../index.js"

// Generate new graph. This function should indicate the edges and node positions
// id, dragable, color will be handled by the graphArea component.
// For now it is hard coded. Randomizer in the future would be better
function generateGraphMatrix() {

  let type = 1//randomValue(1,2)
  
  let nodesPositions;
  let adjMatrix;
  let adjList;

  if (type === 2) {
    
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
    nodesPositions = [{x:10, y:50, color: "white"}, {x:50, y:50, color: "white"}, {x:20, y:70, color: "white"}]
    adjList = {
      1: [2, 3],
      2: [1],
      3: [1]
    }
    adjMatrix = [
      [0, 1, 1], 
      [1, 0, 0], 
      [1, 0, 0]];
  }
  return [adjMatrix, nodesPositions, adjList]
}

export const ALG = {
  BFS: 'bfs',
  DFS: 'dfs',
}

const generateAdjList = (directed) => {
  const STARTCOLOR = "black"
  let adj = {
    1: [2,4,6],
    2: [1,3,4,5,7],
    3: [2,5,8],
    4: [1,2,6,7],
    5: [2,3,7,8,10],
    6: [1,4,9,11],
    7: [2,4,5,9,10,12],
    8: [3,5,10,13],
    9: [4,6,7,11,12,14],
    10: [5,7,8,12,13,15],
    11: [6,9,14,16],
    12: [7,9,10,14,15,17],
    13: [8,10,15,18],
    14: [9,11,12,16,17],
    15: [10,12,13,17,18],
    16: [11,14,17],
    17: [12,14,15,16,18],
    18: [13,15,17],
  }

  for(const node1 in adj) {
    for (const node2 of adj[node1]) {
      adj[node2] = shuffleArray(adj[node2]).slice(0, randomValue(0, adj[node2].length))
    }
  }

  if (!directed) {
    for(const node1 in adj) {
      for (const node2 of adj[node1]) {
        if (!adj[node2].includes(+node1)) {
          adj[node2].push(+node1)
        }
      }
    }
  }

  for (const node1 in adj) {
    adj[node1] = adj[node1].map(val => ({node: val, weight: 1, color: STARTCOLOR}))
  }
  return adj
}

const generateNodes = (w, h, margin) => {
  let nodes = [];
  let xStep = (100 - margin*2) / (w-1);
  let yStep = (100 - margin*2) / (h*2-1-1);
  let t = xStep / 2;
  let x = margin;
  let y = margin;
  let toggle = 0;

  for (let row=0; row<h*2-1; row++) {
    for(let col=0; col<w-toggle; col++) {
      nodes.push({x:x, y:y, color:"white"})
      x += xStep
    }
    y += yStep
    x = toggle === 1 ? margin : margin+t;
    toggle = (toggle+1) % 2;
  }

  return nodes
}

const initialState = {
  nodes: generateNodes(3, 4, 10),
//   nodes: [
//   {x:10, y:15, color: "purple"}, // 1
//   {x:30, y:55, color: "white"}, // 2
//   {x:10, y:55, color: "white"}, // 3
//   {x:30, y:15, color: "white"}, // 4
//   {x:30, y:95, color: "white"}, // 5
//   {x:90, y:55, color: "white"}, // 6
//   {x:50, y:55, color: "white"}, // 7
//   {x:50, y:95, color: "white"}, // 8
// ],
  adjList: generateAdjList(false),
  directed: false,
}


const reducer = (state, action) => {
  switch(action.type) {
    case 'addVertex':
      return {...state,
        nodes: [...state.nodes, action.v],
        adjList: {...state.adjList, [action.v]: []}
      }
    case 'addEdge':
      
      let v = action.v
      let adjV;
      if (!state.adjList.hasOwnProperty(v)) {
        adjV = []
      } else {
        adjV = [...state.adjList.v]
      }
      let w = action.w
      let adjW
      if (!state.adjList.hasOwnProperty(w)) {
        adjW = []
      } else {
        adjW = [...state.adjList.w]
      }

      if (!adjV.includes(w)) {
        adjV.push(w)
      }

      if (!adjW.includes(v)) {
        adjW.push(v)
      }

      // Bracket notation 
      // https://stackoverflow.com/questions/2241875/how-to-create-an-object-property-from-a-variable-value-in-javascript
      return {
        ...state,
        adjList: {...state.adjList, [v]: adjV, [w]: adjW}
      };
    case 'update':
      return {...state, adjList: action.adj, nodes: action.nodes}
    default:
      return state
  }
}

export default function GraphVisualisation() {
  
  
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const demoRef = useRef();
  
  const [network, setNetwork] = useState({adjMatrix: [], adjList: {}, initNodesPositions: [], nodesPositions: [], step:0, start: 0, current: 0, timer: null, visCompleted: false, reset: 0})
  const [networkGraph, dispatchNetworkGraph] = useReducer(reducer, initialState);
  const [moves, setMoves] = useState([])
  const [steps, setSteps] = useState()
  const [alogrithm, setAlgorithm] = useState(ALG.BFS)
  const timerIdRef = useRef();

  // Sorts one step
  const runAnimation = () => {
    let nextStep = steps.next()
    if (nextStep.done === true) {
      setNetwork((prev) => {
        clearInterval(prev.timer) 
        return {...prev, visCompleted: true, timer: null}
      })
    } else {
      dispatchNetworkGraph({type: 'update', adj:nextStep.value.adj, nodes:nextStep.value.nodes})
    }
        
    // setNetwork((prev) => {
    //   let nextStep = steps.next()
    //   if (nextStep.done === true) {
    //     clearInterval(prev.timer)
    //     return {...prev, visCompleted: true, timer:null}
    //   }

    //   let nodeColors = prev.nodesPositions.map((n, i) => ({...n, color: nextStep.value.visited.includes(i) ? "red" : "white"}))
    //   nodeColors[nextStep.value.current].color = "purple"
    //   nodeColors[prev.start].color = "green"
    //   console.log("worked at least once")
    //   return {
    //   ...prev, nodesPositions: nodeColors, step: prev.step+1
    //   }});
  }

  // due to strict mode setArray runs twice with the same end result cus no modifications, however
  // two timers get created and we need to have EXACTLY 1 (otherwise pause will not work).
  // Currently uses a useRef to store timer id which we clear on second call, but this seems a bit hacky
  // so this might break later on!
  // We can also use a global variable instead of useRef I think...
  const runSort = (ms) => {

      setNetwork((prev) => {
      clearInterval(timerIdRef.current)
      const intervalTimer = setInterval(() => runAnimation(), ms)
      
      timerIdRef.current = intervalTimer;
      console.log("timer set", intervalTimer)
      return {...prev, timer: intervalTimer}
      })
  }

  // Clear timer and update the state
  const pauseVisualisation = () => {
    setNetwork((prev) => {
    clearInterval(prev.timer) // Works even if prev.timer is null
    return {...prev, timer: null}
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
// useEffect(() => { 
//   setMoves((prev) => {
//   let traverser;
//   if (alogrithm === ALG.BFS) {
//     traverser = new BFS();
//   } else if (alogrithm === ALG.DFS) {
//     traverser = new DFS();
//   }
//   // gen.current = traverser.bfs(0,1, network.adjMatrix);
//   return traverser.get_graph_steps(0,1, network.adjMatrix)
//   });
// }, [network.initNodesPositions, alogrithm])
  const algorithmSelector = (alg, adjMatrix, nodes) => {
    
    setSteps((prev) => {
      let traverser;
      if (alg === ALG.BFS) {
        traverser = new BFS();
      } else if (alg === ALG.DFS) {
        traverser = new DFS();
      }
      return traverser.stepGenerator(1, 1, adjMatrix, nodes)
    }); 
  }

  useEffect(() => { 
    // algorithmSelector(alogrithm, network.adjMatrix);
    algorithmSelector(alogrithm, networkGraph.adjList, networkGraph.nodes);
  }, [network.initNodesPositions, alogrithm, network.reset])

    const generateGraph = () => {
      setNetwork((prev) => {
        clearInterval(prev.timer);
        let newM = generateGraphMatrix();
        return {...prev, adjMatrix: newM[0], adjList: newM[2], initNodesPositions: newM[1],  nodesPositions: newM[1], timer: null}
      })
    }

  // When the nodepositions are reset, no new moves are generated. But the old moves are still
  // correct and we set the step to 0 so that it start correctly again
  const resetNetwork = () => {
    setNetwork((prev) => {
      clearInterval(prev.timer);

      return {...prev, nodesPositions: prev.initNodesPositions, step:0, timer:null, reset: (prev.reset + 1) % 2}
    })
}

  // Generate network graph
  useEffect(() => {
    setNetwork((prev) => {
      if (prev.initNodesPositions === null || prev.initNodesPositions.length === 0) {
        let newM = generateGraphMatrix();
        return {...prev, adjMatrix: newM[0], adjList: newM[2], initNodesPositions: newM[1],  nodesPositions: newM[1]}
      }
      return prev
    })
  }, [width, height])

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

  return (
    <div style={{display: "flex"}}>
      
      <div ref={demoRef} style={visStyle}>
        {/* <GraphArea width={width} height={height} network={network}/> */}
        <GraphArea2 width={width} height={height} network={networkGraph}/>
      </div>
      
      <div style={sideMenuStyle}>
        <SideMenuGeneric>
          <GraphGenButtons generate={generateGraph} reset={resetNetwork}/>
          <PlayPause timer={network.timer} runVis={runSort} pause={pauseVisualisation}/>
          <AlgSelection algs={ALG} alg={alogrithm} switchAlg={switchAlgorithm}/>
          <button onClick={() => {dispatchNetworkGraph({type: 'addEdge', v:1, w:2})}}>edge</button>
        </SideMenuGeneric>
      </div>
    </div>
  );

}