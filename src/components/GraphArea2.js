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
      if (props.network.nodes != null) {
        return props.network.nodes.map((node, index) => (
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
      let edges2 = new Set()
      console.log("edges calculated")

      for (const node1 in props.network.adjList) {
        for (const edge of props.network.adjList[node1]) {
          const node2 = edge.node;
          let uniqueEdgeKey = "from" + node1 + "to" + node2
          if (node1 <= nodes.length && node2 <= nodes.length) {
            if ((!props.network.directed && !edges2.has("from" + node2 + "to" + node1)) || props.network.directed) {
              edges.push(
                {
                  id: uniqueEdgeKey,
                  node1: node1 - 1, // ajdlist uses starts with node 1, while list uses 0 at start
                  node2: node2 - 1,
                  color: edge.color
                }
              )
              edges2.add(uniqueEdgeKey)
            }
          } else {
            // console.warn("An edge in the adjacency list was detected, of which at least 1 node was not included in the nodes list", 
            // "nodes: ", node1, node2);
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
              color={edge.color}
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