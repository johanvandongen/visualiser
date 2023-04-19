import React, { useEffect, useReducer, useRef, useState } from "react";
import GraphArea from "./GraphArea"
import { visStyle, sideMenuStyle } from "../App.js";
import { BFS } from '../algorithms/graphAlgs/BFS'
import { DFS } from '../algorithms/graphAlgs/DFS'
import {SideMenuGeneric, PlayPause, AlgSelection, GraphGenButtons} from "../index.js"
import { GraphFactory } from "../utils/graphGeneration/GraphFactory.js";
import { useWidthHeight } from "../hooks/useWidthHeight";
import { usePlayPause } from "../hooks/usePlayPause";

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
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'addVertex':
      let newNodeNum = state.nodes.length
      return {...state,
        nodes: [...state.nodes, {node: newNodeNum, color:"white", x:action.pos.x/action.w*100, y:action.pos.y/action.h*100, id:'node'+newNodeNum}],
        adjList: {...state.adjList, [newNodeNum]: []},
        reset: (state.reset + 1) % 2
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

      return {
        ...state,
        adjList: {...state.adjList, [action.v]: adjV, [action.w]: adjW},
        reset: (state.reset + 1) % 2
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
        reset: (state.reset + 1) % 2}
    case 'triggerStartVis':
      return {...state, reset: (state.reset + 1) % 2} // Dummy field triggers fresh step generator object
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
  const [isPlaying, setIsPlaying] = useState({playing: false, finished: false, delay:203})

  usePlayPause(() => {
      let nextStep = steps.next()
      if (nextStep.done === true) {
        setIsPlaying({playing: false, finished: true})
        dispatchNetworkGraph({type: 'triggerStartVis'})
      } else {
        dispatchNetworkGraph({type: 'update', adj:nextStep.value.adj, nodes:nextStep.value.nodes})
      }
    }, isPlaying.playing ? isPlaying.delay : null
  )

  const runVis = (ms) => {
    setIsPlaying((prev) => {return {...prev, playing:true, delay: ms}})
  }

  const pauseVisualisation = () => {
    setIsPlaying((prev) => {return {...prev, playing:false}})
  }

  const setNewGraph = (connectness, w, h) => {
    setIsPlaying((prev) => {return {...prev, playing:false, finished: false}})

    const networkGraph = GraphFactory("diamond", false, connectness, w, h)
    dispatchNetworkGraph({type: 'setNewGraph', adj:networkGraph[1], nodes:networkGraph[0]})
    dispatchNetworkGraph({type: 'triggerStartVis'})
  }

  const resetNetwork = () => {
    setIsPlaying((prev) => {return {...prev, playing:false, finished: false}})
    dispatchNetworkGraph({type: 'reset'})
  }

  const switchAlgorithm = (event) => {
    setIsPlaying((prev) => {return {...prev, playing:false, finished: false}}) 
    setAlgorithm(event.target.value);
    console.log(`Switched to: ${event.target.value}`)
  }

  // Set new moves
  const algorithmSelector = (alg, adjList, nodes) => {
    setSteps((prev) => {
      let traverser;
      if (alg === ALG.BFS) {
        traverser = new BFS();
      } else if (alg === ALG.DFS) {
        traverser = new DFS();
      }
      return traverser.stepGenerator(networkGraph.start, networkGraph.end, adjList, nodes)
    }); 
  }

  useEffect(() => { 
    if (isPlaying.finished === false && isPlaying.playing === false) {
      algorithmSelector(alogrithm, networkGraph.adjList, networkGraph.nodes);
    }
  }, [alogrithm, networkGraph.reset])

  useEffect(() => { 
    dispatchNetworkGraph({type: 'reset'})
  }, [alogrithm])

  return (
    <div style={{display: "flex"}}>
      
      <div ref={demoRef} style={visStyle}>
        <GraphArea width={width} height={height} network={networkGraph} 
        updateNodes={ (id, pos) => dispatchNetworkGraph({type:'updateNodes', pos: pos, id:id, w:width, h:height}) } 
        addNode={ (pos) => {dispatchNetworkGraph({type: 'addVertex', v:5, pos: pos, w:width, h:height})} }
        addEdge={ (v, w) => {dispatchNetworkGraph({type: 'addEdge', v:v, w:w})} }
        setStart={ (start) => dispatchNetworkGraph({type: 'setStart', start:start}) }
        setEnd={ (end) => dispatchNetworkGraph({type: 'setEnd', end:end}) }/>
      </div>
      
      <div style={sideMenuStyle}>
        <SideMenuGeneric>
          <GraphGenButtons generate={setNewGraph} reset={resetNetwork}/>
          <PlayPause isPlaying={isPlaying.playing} runVis={runVis} pause={pauseVisualisation}/>
          <AlgSelection algs={ALG} alg={alogrithm} switchAlg={switchAlgorithm}/>
        </SideMenuGeneric>
      </div>
    </div>
  );

}