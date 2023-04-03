import React from "react";
import { Line, Text } from 'react-konva';

export default function GraphVisualisation(props) {

    return (
        <>
        <Line
        key = {props.id}
        id = {props.id}
            points = {[props.node1.x, props.node1.y, props.node2.x, props.node2.y]}
            stroke = {props.color}
            strokeWidth = {3}
        />
        {props.weighted && <Text
        fill="red"
        x={(props.node1.x + props.node2.x) / 2 - 150}
        y={(props.node1.y + props.node2.y) / 2 - 150}
        width={300}
        height={300}
        align="center"
        verticalAlign="middle"
        text={props.weight}
      />}
      </>
    )

}