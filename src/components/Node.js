import React from "react";
import { Text, Circle, Group } from 'react-konva';
import { COLORS } from "../colors";

export default function GraphVisualisation(props) {

    return (
        
      <Group
        id={props.node.id} //Important that the id/key is the same as the id of a node object, so dragging works properly
        key={props.node.id}
        x={props.node.x}
        y={props.node.y}
        nodeNumber={props.index}
        draggable
        onDragMove={props.handleDrag}>
        <Circle
          id={"Circle" + props.node.id}
          key={"Circle" + props.node.id}
          radius={props.nodeSize}
          fill={props.node.color}
          shadowBlur={10}
          shadowOpacity={0.6}
        />
        <Text
          type={"nodeText"}
          id={"CircleText" + props.node.id}
          key={"CircleText" + props.node.id}
          fontSize={props.nodeSize}
          text={props.index+1}
          fill={props.node.color === COLORS.softBlack1 ? "white" : "black"}
          x={- props.nodeSize}
          y={- props.nodeSize}
          width={2*props.nodeSize}
          height={2*props.nodeSize}
          align="center"
          verticalAlign="middle"/>
      </Group>

    )

}