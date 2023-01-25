import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Circle } from 'react-konva';
import Edge from './Edge'

export default function GraphVisualisation(props) {
  // console.log("area rerendered")

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [nodeSize, setNodeSize] = useState(30)

  // When nodes get dragged update their position in react state 
  // (needed to update edge positions)
  const handleDrag = (e) => {
    const id =e.target.id()
    const pos = e.target.position()
    setNodes((prev) => {
      if (prev != null && prev.length > 0) {
        let nodesCopy = JSON.parse(JSON.stringify(prev))
        for (let i = 0; i< nodesCopy.length; i++) {
          
          if (nodesCopy[i].id === id) {
            nodesCopy[i] = {...nodesCopy[i], ...pos}
          }
        }
        return nodesCopy
      } else {
        return prev
      }
    })
  }

  // Load in graph network from props
  useEffect(() =>{
    setNodes((prev) => {
      if (props.network.nodesPositions != null) {
        return props.network.nodesPositions.map((node, index) => (
          {...node, 
            isDragging: false, 
            id: "node" + index,
            x: node.x / 100 * props.width, // Scale to fit whole canvas
            y: node.y / 100 * props.height,
          }))
      } else {
        return []
      }
    })
  }, [props])

  // Loop over right triangle in adjacency matrix
  useEffect(() => {
    setEdges(() => {
      let edges = []
      
      for (let i=0; i < props.network.adjMatrix.length; i++) {
        for (let j=i; j < props.network.adjMatrix[i].length; j++) {
          if (props.network.adjMatrix[i][j] === 1 && i !== j) {
            let uniqueEdgeKey = "from" + i + "to" + j

            edges.push(
              {
                id: uniqueEdgeKey,
                node1: i,
                node2: j
              }
            )
          }
        }
      }
      
      return edges;
    })
  }, [props])

    return (
        <Stage width={props.width} height={props.height}>
          <Layer>
            
            {edges.map((edge) => (
              <Edge
              key={edge.id} 
              id={edge.id} 
              node1={nodes[edge.node1]} 
              node2={nodes[edge.node2]}
              />
            ))}

            {nodes.map((node) => (
              <Circle
                key={node.id}
                id={node.id}
                x={node.x}
                y={node.y}
                radius={nodeSize}
                // fill="white"
                fill={node.color}
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