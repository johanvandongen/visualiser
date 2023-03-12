import React, { useEffect, useReducer, useRef, useState } from "react";
import {COLORS} from '../colors.js'
import GraphArea from "./GraphArea"
import { visStyle, sideMenuStyle } from "../App.js";
import { BFS } from '../graphAlgs/BFS'
import { DFS } from '../graphAlgs/DFS'
import { randomValue, shuffleArray, inBound } from '../helpers.js'
import {SideMenuGeneric, PlayPause, AlgSelection, GraphGenButtons} from "../index.js"

export const ALG = {
  BFS: 'bfs',
  DFS: 'dfs',
}

const generateDiamondAdj = (w, h) => {
  let nrOfNodes = w*h + (w-1)*(h-1);
  let adj = {}
  let toggle = 0;
  let count = 1

  for (let row=0; row<h*2-1; row++) {
    for(let col=0; col<w-toggle; col++) {

      if (col===0 && toggle===0) { // Left col
        adj[count] = inBound([count-((w-1)*2+1), count-w+1, count+w, count+(w-1)*2+1], 1, nrOfNodes)
      } else if (col===w-toggle-1 && toggle===0) { // Right col
        adj[count] = inBound([count-((w-1)*2+1), count+w-1, count-w, count+(w-1)*2+1], 1, nrOfNodes)
      } else if (row===0 || row===h*2-1-1) { // top and bottom row
        if (!adj.hasOwnProperty(count)) {
          adj[count] = inBound([count-1, count+1], 1, nrOfNodes)
        } else {
          adj[count].push(...inBound([count-1, count+1], 1, nrOfNodes))
        }
      } else {
        adj[count] = inBound([count-w, count-w+1, count+w, count+w-1, count+w+(w-1), count-(w+(w-1))], 1, nrOfNodes)
      }

      count += 1
    }
    toggle = (toggle+1) % 2;
  }
  return adj
}

const generateAdjList = (w, h, directed, connectness=100) => {
  const STARTCOLOR = "black"
  let adj = generateDiamondAdj(w,h)

  // Select random edges
  if (connectness!==100) {
    for(const node1 in adj) {
        adj[node1] = shuffleArray(adj[node1]).slice(0, randomValue(0, adj[node1].length))
    }
  }

  // Make sure adjacency list is correct u: [v, ..] means also v: [u, ..]
  if (!directed) {
    for(const node1 in adj) {
      for (const node2 of adj[node1]) {
        if (!adj[node2].includes(+node1)) {
          adj[node2].push(+node1)
        }
      }
    }
  }

  // Add attributes to each edge (weight, color, etc..)
  for (const node1 in adj) {
    adj[node1] = adj[node1].map(val => ({node: val, weight: 1, color: STARTCOLOR}))
  }

  return adj
}
/**
 * 
 * @param {number} w number of nodes in a row (alternating between w and w-1)
 * @param {number} h number of rows of full width, so additional of h-1 rows of w-1 width
 * @param {number} margin margin for position of nodes w.r.t graph area boundaries
 * @returns list of nodes
 */
const generateNodes = (w, h, margin) => {
  let nodes = [];
  let xStep = (100 - margin*2) / (w-1);
  let yStep = (100 - margin*2) / (h*2-1-1);
  let t = xStep / 2;
  let x = margin;
  let y = margin;
  let toggle = 0;

  // Creates nodes in diamond like pattern
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
  nodes: generateNodes(5, 5, 10),
  adjList: generateAdjList(5, 5, false),
  directed: false,
  reset: 0,
  timer: null
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
    case 'reset':
      return {...state, 
        adjList: Object.fromEntries(
          Object.entries(state.adjList).map(([node, l]) => 
          [node, l.map(edge => ({...edge, color:'black'}))])
          ),
        nodes: state.nodes.map((node) => ({...node, color: 'white'}))}
    case 'triggerStartVis':
      return {...state, reset: (state.reset + 1) % 2, timer: action.timer}
    default:
      return state
  }
}

export default function GraphVisualisation() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const demoRef = useRef();

  const [networkGraph, dispatchNetworkGraph] = useReducer(reducer, initialState);
  const [steps, setSteps] = useState()
  const [alogrithm, setAlgorithm] = useState(ALG.BFS)
  const timerIdRef = useRef();

  // Sorts one step
  const runAnimation = () => {
    let nextStep = steps.next()
    if (nextStep.done === true) {
      clearInterval(timerIdRef.current)
      dispatchNetworkGraph({type: 'triggerStartVis', timer: null})
    } else {
      dispatchNetworkGraph({type: 'update', adj:nextStep.value.adj, nodes:nextStep.value.nodes})
    }
  }

  // due to strict mode setArray runs twice with the same end result cus no modifications, however
  // two timers get created and we need to have EXACTLY 1 (otherwise pause will not work).
  // Currently uses a useRef to store timer id which we clear on second call, but this seems a bit hacky
  // so this might break later on!
  // We can also use a global variable instead of useRef I think...
  const runSort = (ms) => {
    clearInterval(timerIdRef.current)
    const intervalTimer = setInterval(() => runAnimation(), ms)
    timerIdRef.current = intervalTimer;
    dispatchNetworkGraph({type:'triggerStartVis', timer: intervalTimer})
  }

  // Clear timer and update the state
  const pauseVisualisation = () => {
    clearInterval(timerIdRef.current)
    dispatchNetworkGraph({type: 'triggerStartVis', timer: null})
  }

  const switchAlgorithm = (event) => {
    clearInterval(timerIdRef.current)
    dispatchNetworkGraph({type: 'triggerStartVis', timer: null}) 

    setAlgorithm(event.target.value);
    console.log("Switched to", event.target.value)
  }

// Set new moves
const algorithmSelector = (alg, adjMatrix, nodes) => {
  
  setSteps((prev) => {
    let traverser;
    if (alg === ALG.BFS) {
      traverser = new BFS();
    } else if (alg === ALG.DFS) {
      traverser = new DFS();
    }
    console.log("switched to: ", alg)
    return traverser.stepGenerator(1, 1, adjMatrix, nodes)
  }); 
}

  useEffect(() => { 
    algorithmSelector(alogrithm, networkGraph.adjList, networkGraph.nodes);
  }, [alogrithm, networkGraph.reset])

  const generateGraph = () => {
    clearInterval(timerIdRef.current)
    let w = 4
    let h = 4
    let nodes = generateNodes(w, h, 5)
    let adj = generateAdjList(w,h, false, 80)

    dispatchNetworkGraph({type: 'update', adj:adj, nodes:nodes})
    dispatchNetworkGraph({type: 'triggerStartVis', timer: null})
  }

  // When the nodepositions are reset, no new moves are generated. But the old moves are still
  // correct and we set the step to 0 so that it start correctly again
  const resetNetwork = () => {
    clearInterval(timerIdRef.current)
    dispatchNetworkGraph({type: 'triggerStartVis', timer: null})
    dispatchNetworkGraph({type: 'reset'})
}

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
        <GraphArea width={width} height={height} network={networkGraph}/>
      </div>
      
      <div style={sideMenuStyle}>
        <SideMenuGeneric>
          <GraphGenButtons generate={generateGraph} reset={resetNetwork}/>
          <PlayPause timer={networkGraph.timer} runVis={runSort} pause={pauseVisualisation}/>
          <AlgSelection algs={ALG} alg={alogrithm} switchAlg={switchAlgorithm}/>
          <button onClick={() => {dispatchNetworkGraph({type: 'addEdge', v:1, w:2})}}>edge</button>
        </SideMenuGeneric>
      </div>
    </div>
  );

}