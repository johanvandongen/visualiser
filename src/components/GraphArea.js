import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Circle } from 'react-konva';
import Edge from './Edge'
import Node from './Node'
import { COLORS } from "../utils/colors";

export default function GraphVisualisation(props) {
  console.log("graphh rerendered")

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [newEdge, setNewEdge] = useState({node1: null, node2: null})
  const [nodeSize, setNodeSize] = useState(30)

  // When nodes get dragged update their position in react state 
  // (needed to update edge positions)
  const handleDrag = (e, key) => {
    console.log(key)
    const id =e.target.id()
    const pos = e.target.position()
    if (key === "Shift") {
      console.log(e.target)
      console.log(this)
    }
    props.updateNodes(id, pos)
  }

  // Load in graph network from props
  useEffect(() =>{
    setNodes((prev) => {
      if (props.network.nodes != null) {
        return props.network.nodes.map((node, index) => (
          {...node, 
            isDragging: false, 
            id: "node" + index,
            color: props.network.start === index+1 ? COLORS.visHighlight2 :  props.network.end === index+1 ? COLORS.visHighlight1 : node.color, 
            x: node.x / 100 * props.width, // Scale to fit whole canvas
            y: node.y / 100 * props.height,
          }))
      } else {
        return []
      }
    })
  }, [props])

  // Loop over adjacency list
  useEffect(() => {
    setEdges(() => {
      let edges = []
      let edges2 = new Set()

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
                  color: edge.color,
                  weight: edge.weight,
                  weighted: props.network.weighted
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

  const keyRef = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      keyRef.current = event.key
    };

    const handleKeyUp = (event) => {
      keyRef.current = "none"
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleShiftClick = (e) => {
    let pos = e.target.parent.position()
    let node = e.target.parent.attrs.nodeNumber
    if (newEdge.node1 !== null) {
      props.addEdge(newEdge.nn1+1, node+1)
    }
    setNewEdge((prev) => {
      if (e.target.attrs.type === "nodeText") {
        if (prev.node1 === null) {
          return {...prev, node1: nodes[node], nn1: node }
        } else {
          return {node1: null, node2: null}
        }
      } else {
        return {...prev}
      }
    })
  }

  const handleAClick = (e) => {
    let pos;
    let type = e.target.attrs.type 
    if (type === "stage") {
      pos = e.target.getRelativePointerPosition()
    } else if (type === "weightText") {
      pos = e.target.position()
    } else if (type === "nodeText") {
      let reletiveTextPos = e.target.getRelativePointerPosition()
      let textDim = e.target.position()
      let nodePos = e.target.parent.position()
      pos = {
        x:nodePos.x + reletiveTextPos.x + textDim.x,
        y:nodePos.y + reletiveTextPos.y + textDim.y
      }
    } else {
      console.warn("position could not be determined properly")
      return
    }
    props.addNode(pos)
  }

  const handleClick = (e, key) => {
    if (key === "a") {
      handleAClick(e)
    } else if (key === "Shift") {
      handleShiftClick(e)
    } else if (key === "s") {
      e.target.attrs.type === "nodeText" && props.setStart(e.target.parent.attrs.nodeNumber+1)
    } else if (key === "e") {
      e.target.attrs.type === "nodeText" && props.setEnd(e.target.parent.attrs.nodeNumber+1)
    } else if (key === "r") {
      props.setEnd(null)
    }else {
      console.log(key)
    }
  }

    return (
        <Stage type={"stage"} width={props.width} height={props.height} onclick={(e) => handleClick(e, keyRef.current)}>
          <Layer>
            
            {edges.map((edge) => (
              <Edge
              key={edge.id} 
              id={edge.id} 
              node1={nodes[edge.node1]} 
              node2={nodes[edge.node2]}
              color={edge.color}
              weight={edge.weight}
              weighted={edge.weighted}
              />
            ))}

            {nodes.map((node, index) => (
              <Node
                key={"Node" + index}
                id={"Node" + index}
                node={node}
                nodeSize={nodeSize}
                handleDrag={(e) => handleDrag(e, keyRef.current)}
                index={index}
              />
            ))}

            {newEdge.node1 !== null && 
            <Circle
              key={"newedge"} 
              id={"newedge"} 
              stroke={"green"}
              radius={nodeSize}
              x={newEdge.node1.x}
              y={newEdge.node1.y}
            />
              }
          </Layer>
        </Stage>
    )

}