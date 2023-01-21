import React, { useEffect, useRef, useState } from "react";
import {COLORS} from '../colors.js'
import GraphArea from "./GraphArea"
import SideMenuGraph from "./SideMenuGraph.js";
import { visStyle, sideMenuStyle } from "../App.js";

// Generate new graph. This function should indicate the edges and node positions
// id, dragable, color will be handled by the graphArea component.
// For now it is hard coded. Randomizer in the future would be better
function generateGraphMatrix(type) {
  
  let nodesPositions;
  let adjMatrix;
  if (type===1) {
    
    nodesPositions = [
      {x:10, y:15}, // 1
      {x:30, y:55}, // 2
      {x:10, y:55}, // 3
      {x:30, y:15}, // 4
      {x:30, y:95}, // 5
      {x:90, y:55}, // 6
      {x:50, y:55}, // 7
      {x:50, y:95}, // 8
      {x:70, y:15}, // 9
      {x:70, y:55}, // 10
      {x:90, y:15}, // 11
      {x:10, y:95}, // 11
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

export default function GraphVisualisation() {
  console.log("graphVis rerendered")
  
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const demoRef = useRef();
  
  const [network, setNetwork] = useState({adjMatrix: [], nodesPositions: []})

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
      return {...prev, adjMatrix: newM[0], nodesPositions: newM[1]}
    })
  }, [width, height])

  return (
    <div style={{display: "flex"}}>
      
      <div ref={demoRef} style={visStyle}>
        <GraphArea width={width} height={height} network={network}/>
      </div>
      
      <div style={sideMenuStyle}>
        <SideMenuGraph/>
      </div>
    </div>
  );

}