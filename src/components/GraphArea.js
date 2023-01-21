import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Circle } from 'react-konva';
import Edge from './Edge'

export default function GraphVisualisation(props) {
  console.log("area rerendered")

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

  const handleDrag2 = (e) => {
    const id =e.target.id()
    const pos = e.target.position()
    setNodes((prev) => {
      console.log("prev", prev)
      return prev
    })
  }
  // const BLUE1_DEFAULTS = {
  //   id: 1,
  //   x: 100,
  //   y: 100,
  //   fill: "blue",
  //   width: 30,
  //   height: 30,
  //   draggable: true
  // };
  
  // const BLUE2_DEFAULTS = {
  //   id: 2,
  //   x: 100,
  //   y: 300,
  //   fill: "blue",
  //   width: 30,
  //   height: 30,
  //   draggable: true
  // };

  // const BLUE3_DEFAULTS = {
  //   id: 3,
  //   x: 100,
  //   y: 400,
  //   fill: "blue",
  //   width: 30,
  //   height: 30,
  //   draggable: true
  // };

  useEffect(() =>{
    setNodes((prev) => {
      
      if (props.matrix.nodesPositions != null) {
        // const map1 = new Map();
        // for (let i = 0; i< props.matrix.nodesPositions.length; i++) {
        //   console.log(props.matrix.nodesPositions[i])
        //   map1.set("node"+i, {...props.matrix.nodesPositions[i], isDragging: false, id: "node"+i})
        // }
        // console.log("maphere", map1)
        // return map1
        return props.matrix.nodesPositions.map((node, index) => ({...node, isDragging: false, id: "node"+index}))
      } else {
        return []
      }
    })
  }, [props])

  // Loop over right triangle in matrix
  // useEffect(() => {
  //   setEdges(() => {
  //     console.log("edge changed")
  //     let edges = []
  //     for (let i=0; i < props.matrix.matrixx.length; i++) {
  //       for (let j=i; j < props.matrix.matrixx[i].length; j++) {
  //         if (nodes != null && nodes.length > 0 && props.matrix.matrixx[i][j] === 1 && i !== j){
  //           let uniqueEdgeKey = "from" + i + "to" + j
  //           edges.push( 
  //             <Edge key={uniqueEdgeKey} id={uniqueEdgeKey} node1={nodes[i]} node2={nodes[j]}/>
  //           )
  //         }
  //       }
  //     }
  //     return edges;
  //   }  
  //   )

  // }, [props])

  // const [blueNodes, updateBlueNodes] = React.useState([BLUE1_DEFAULTS, BLUE2_DEFAULTS, BLUE3_DEFAULTS])

  // const test = (e) => {
    
  //   updateBlueNodes((prev) => {
      
  //     const id =e.target.id()
  //     const pos = e.target.position()
  //     if (prev != null && prev.length > 0) {
  //       let nodesCopy = JSON.parse(JSON.stringify(prev))
  //       for (let i = 0; i< nodesCopy.length; i++) {
          
  //         if (nodesCopy[i].id === id) {
  //           // console.log("id mathced", id)
  //           nodesCopy[i] = {...nodesCopy[i], ...pos}
  //         }
  //       }
  //       return nodesCopy
  //     } else {
  //       return prev
  //     }
  //   })

  // }

    return (
        <>

        <Stage width={props.width} height={props.height}>
          <Layer>
            {/* {blueNodes.map((node) => (
              
          <Circle
          {...node}
          onDragMove={test}/>
              
            ))} */}
        {/* <Edge id={1} node1={blueNodes[0]} node2={blueNodes[1]}/>
        <Edge id={1} node1={blueNodes[2]} node2={blueNodes[1]}/> */}
            {/* {edges} */}

            {/* <Edge key={1} id={1} node1={nodes[0]} node2={nodes[1]}/> */}
            {/* {Array.from(nodes, ([name, node]) => (
              <Circle
              key={node.id}
              id={node.id}
              x={node.x}
              y={node.y}
              width={20}
              height={20}
              stroke="black"
              fill="white"
              draggable
              shadowBlur={10}
              shadowOpacity={0.6}
              // onDragMove={handleDrag2}
              />
              ))} */}

            {nodes.map((node) => (
              <Circle
                key={node.id}
                id={node.id}
                x={node.x}
                y={node.y}
                width={20}
                height={20}
                stroke="black"
                fill="white"
                draggable
                shadowBlur={10}
                shadowOpacity={0.6}
                // onDragMove={handleDrag}
              />
            ))}
          </Layer>
        </Stage>
        </>
    )

}