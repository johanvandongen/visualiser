import React from "react";
import { Line, Text } from 'react-konva';
import { COLORS } from "../colors";

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
        type={"weightText"}
        fill={COLORS.softBlack1}
        x={(props.node1.x + props.node2.x) / 2 - 10}
        y={(props.node1.y + props.node2.y) / 2 - 10}
        width={20}
        height={20}
        align="center"
        verticalAlign="middle"
        fontSize={16}
        text={props.weight}
      />}
      </>
    )

}