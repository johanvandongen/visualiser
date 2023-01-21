import React from "react";
import { Line } from 'react-konva';

export default function GraphVisualisation(props) {

    return (
        <Line
        key = {props.id}
        id = {props.id}
            points = {[props.node1.x, props.node1.y, props.node2.x, props.node2.y]}
            stroke = 'black'
            strokeWidth = {3}
        />
    )

}