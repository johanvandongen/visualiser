import React, { useEffect, useRef } from "react";
import { Stage, Layer, Star, Text, Circle, Line } from 'react-konva';

export default function GraphVisualisation(props) {
    console.log("this is the problem no")
 

    return (
        <Line
        key = {props.id}
        id = {props.id}
            points = {[props.node1.x, props.node1.y, props.node2.x, props.node2.y]}
            stroke = 'black'
        />
    )

}