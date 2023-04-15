import React, { useEffect, useReducer, useRef, useState } from "react";
import GraphArea from "./GraphArea"
import { visStyle, sideMenuStyle } from "../App.js";
import { BFS } from '../algorithms/graphAlgs/BFS'
import { DFS } from '../algorithms/graphAlgs/DFS'
import {SideMenuGeneric, PlayPause, AlgSelection, GraphGenButtons} from "../index.js"
import { GraphFactory } from "../utils/graphGeneration/GraphFactory.js";
import { useWidthHeight } from "../hooks/useWidthHeight";

export const ALG = {
  BFS: 'bfs',
  DFS: 'dfs',
}
const networkGraph = GraphFactory("diamond", false, 100, 5, 5)

const initialState = {
  nodes: networkGraph[0],
  adjList: networkGraph[1],
  start: 1,
  end: null,
  directed: false,
  weighted: false,
  reset: 0,
  timer: null,
  visCompleted: false
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'addVertex':
      return {...state,
        nodes: [...state.nodes, {node: action.v, color:"white", x:action.pos.x/action.w*100, y:action.pos.y/action.h*100, id:'node'+state.nodes.length}],
        adjList: {...state.adjList, [action.v]: []}
      }
    case 'addEdge':
      let adjV = state.adjList.hasOwnProperty(action.v) ? [...state.adjList[action.v]] : []
      let adjW = state.adjList.hasOwnProperty(action.w) ? [...state.adjList[action.w]] : []

      for (const node2 of adjV) {
        if (node2.node === action.w) {
          return {...state}
        }
      }

      for (const node2 of adjW) {
        if (node2.node === action.v) {
          return {...state}
        }
      }

      if (!adjV.includes(action.w)) {
        adjV.push({node: action.w, weight: 1, color:'black'})
      }

      if (!adjW.includes(action.v)) {
        adjW.push({node: action.v, weight: 1, color:'black'})
      }

      // Bracket notation 
      // https://stackoverflow.com/questions/2241875/how-to-create-an-object-property-from-a-variable-value-in-javascript
      return {
        ...state,
        adjList: {...state.adjList, [action.v]: adjV, [action.w]: adjW}
      };
    case 'update':
      return {...state, adjList: action.adj, nodes: state.nodes.map((node, i) => ({...node, color: action.nodes[i].color}))}
    case 'setStart':
      if (action.start === state.end) {
        console.warn("Cant set the end to the same node as the starting node")
        return {...state}
      }
      return {...state, start: action.start, reset: (state.reset + 1) % 2}
    case 'setEnd':
      if (action.end === state.start) {
        console.warn("Cant set the end to the same node as the starting node")
        return {...state}
      }
      return {...state, end: action.end, reset: (state.reset + 1) % 2}
    case 'setNewGraph':
      return {...state, adjList: action.adj, nodes: action.nodes}
    case 'updateNodes':
      return {...state, reset: (state.reset + 1) % 2, nodes: state.nodes.map(node => (node.id===action.id ? Object.assign({}, node, {x: action.pos.x/action.w*100, y: action.pos.y/action.h*100}) : node))}
    case 'reset':
      return {...state, 
        adjList: Object.fromEntries(
          Object.entries(state.adjList).map(([node, l]) => 
          [node, l.map(edge => ({...edge, color:'black'}))])
          ),
        nodes: state.nodes.map((node) => ({...node, color: 'white'})),
        reset: (state.reset + 1) % 2,
        timer: null,
        visCompleted: false}
    case 'triggerStartVis':
      return {...state, 
        reset: action.trigger ? (state.reset + 1) % 2 : state.reset, //dummy field triggers fresh step generator object
        timer: action.timer, // Timer is ao used for play/pause text toggle
        visCompleted: action.visCompleted}
    default:
      return state
  }
}

export default function GraphVisualisation() {
  const demoRef = useRef(null)
  const [width, height] = useWidthHeight(demoRef);

  const [networkGraph, dispatchNetworkGraph] = useReducer(reducer, initialState);
  const [steps, setSteps] = useState()
  const [alogrithm, setAlgorithm] = useState(ALG.BFS)
  const timerIdRef = useRef();

  // Sorts one step
  const runVisStep = () => {
    let nextStep = steps.next()
    if (nextStep.done === true) {
      clearInterval(timerIdRef.current)
      dispatchNetworkGraph({type: 'triggerStartVis', timer: null, visCompleted: true, trigger: true})
    } else {
      dispatchNetworkGraph({type: 'update', adj:nextStep.value.adj, nodes:nextStep.value.nodes})
    }
  }

  // due to strict mode setArray runs twice with the same end result cus no modifications, however
  // two timers get created and we need to have EXACTLY 1 (otherwise pause will not work).
  // Currently uses a useRef to store timer id which we clear on second call, but this seems a bit hacky
  // so this might break later on!
  // We can also use a global variable instead of useRef I think...
  const runVis = (ms) => {
    clearInterval(timerIdRef.current)
    const intervalTimer = setInterval(() => runVisStep(), ms)
    timerIdRef.current = intervalTimer;
    dispatchNetworkGraph({type:'triggerStartVis', timer: intervalTimer, visCompleted: false, trigger: true})
  }

  // Clear timer and update the state
  const pauseVisualisation = () => {
    clearInterval(timerIdRef.current)
    dispatchNetworkGraph({type: 'triggerStartVis', timer: null, visCompleted: false, trigger: false})
  }

  const switchAlgorithm = (event) => {
    clearInterval(timerIdRef.current)
    dispatchNetworkGraph({type: 'triggerStartVis', timer: null, visCompleted: false, trigger: true}) 

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
      return traverser.stepGenerator(networkGraph.start, networkGraph.end, adjMatrix, nodes)
    }); 
  }

  useEffect(() => { 
    if (networkGraph.visCompleted === false && networkGraph.timer === null) {
      algorithmSelector(alogrithm, networkGraph.adjList, networkGraph.nodes);
    }
  }, [alogrithm, networkGraph.reset])

  useEffect(() => { 
    dispatchNetworkGraph({type: 'reset'})
  }, [alogrithm])

  const generateGraph = (connectness, w, h) => {
    clearInterval(timerIdRef.current)
    // let w = 4
    // let h = 4
    const networkGraph = GraphFactory("diamond", false, connectness, w, h)

    dispatchNetworkGraph({type: 'setNewGraph', adj:networkGraph[1], nodes:networkGraph[0]})
    dispatchNetworkGraph({type: 'triggerStartVis', timer: null, visCompleted: false, trigger: true})
  }

  // When the nodepositions are reset, no new moves are generated. But the old moves are still
  // correct and we set the step to 0 so that it start correctly again
  const resetNetwork = () => {
    clearInterval(timerIdRef.current)
    dispatchNetworkGraph({type: 'reset'})
}

  return (
    <div style={{display: "flex"}}>
      
      <div ref={demoRef} style={visStyle}>
        <GraphArea width={width} height={height} network={networkGraph} 
        updateNodes={(id, pos) => dispatchNetworkGraph({type:'updateNodes', pos: pos, id:id, w:width, h:height})} 
        addNode={(pos) => {
          dispatchNetworkGraph({type: 'addVertex', v:5, pos: pos, w:width, h:height})
          dispatchNetworkGraph({type: 'triggerStartVis', timer: null, visCompleted: false, trigger: true}) 
        }}
        addEdge={(v, w) => {
          dispatchNetworkGraph({type: 'addEdge', v:v, w:w})
          dispatchNetworkGraph({type: 'triggerStartVis', timer: null, visCompleted: false, trigger: true}) 
          }}
        setStart={(start) => dispatchNetworkGraph({type: 'setStart', start:start})}
        setEnd={(end) => dispatchNetworkGraph({type: 'setEnd', end:end})}/>
      </div>
      
      <div style={sideMenuStyle}>
        <SideMenuGeneric>
          <GraphGenButtons generate={generateGraph} reset={resetNetwork}/>
          <PlayPause timer={networkGraph.timer} runVis={runVis} pause={pauseVisualisation}/>
          <AlgSelection algs={ALG} alg={alogrithm} switchAlg={switchAlgorithm}/>
        </SideMenuGeneric>
      </div>
    </div>
  );

}