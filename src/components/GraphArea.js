import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Circle } from 'react-konva';
import Edge from './Edge'



export default function GraphVisualisation(props) {
  // console.log("area rerendered")

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  const handleDrag = (e) => {
    const id =e.target.id()
    const pos = e.target.position()
    // console.log("pos handle", pos, id)
    setNodes((prev) => {
      if (prev != null && prev.length > 0) {
        let nodesCopy = JSON.parse(JSON.stringify(prev))
        for (let i = 0; i< nodesCopy.length; i++) {
          
          if (nodesCopy[i].id === id) {
            // console.log("id mathced", id)
            nodesCopy[i] = {...nodesCopy[i], ...pos}
          }
        }
        return nodesCopy
      } else {
        return prev
      }
    })
  }

  useEffect(() =>{
    console.log("joo")
    setNodes((prev) => {
      
      if (props.matrix.nodesPositions != null) {
        return props.matrix.nodesPositions.map((node, index) => ({...node, isDragging: false, id: "node"+index}))
      } else {
        return []
      }
    })
  }, [props])

  // Loop over right triangle in matrix
  useEffect(() => {
    setEdges(() => {
      console.log("edge changed")
      let edges = []
      for (let i=0; i < props.matrix.matrixx.length; i++) {
        for (let j=i; j < props.matrix.matrixx[i].length; j++) {
          if (nodes != null && nodes.length > 0 && props.matrix.matrixx[i][j] === 1 && i !== j){
            let uniqueEdgeKey = "from" + i + "to" + j
            edges.push( 
              <Edge key={uniqueEdgeKey} id={uniqueEdgeKey} node1={nodes[i]} node2={nodes[j]}/>
            )
          }
        }
      }
      return edges;
    }  
    )

  }, [props, nodes])

    return (
        <Stage width={props.width} height={props.height}>
          <Layer>
            {edges}
            {nodes.map((node) => (
              <Circle
                key={node.id}
                id={node.id}
                x={node.x}
                y={node.y}
                radius={10}
                // stroke="black"
                fill="white"
                draggable
                shadowBlur={10}
                shadowOpacity={0.6}
                onDragMove={handleDrag}
              />
            ))}
          </Layer>
        </Stage>
    )

}