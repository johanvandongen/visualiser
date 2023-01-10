import React, { useEffect, useRef } from "react";
import { Stage, Layer, Star, Text } from 'react-konva';

export default function GraphVisualisation(props) {

    return (
        <>
        <Stage width={props.width} height={props.height}>
          <Layer>
            <Text text="Try to drag a star" />
            {props.stars.map((star) => (
              <Star
                key={star.id}
                id={star.id}
                x={star.x}
                y={star.y}
                numPoints={5}
                innerRadius={20}
                outerRadius={40}
                fill="#89b717"
                opacity={0.8}
                draggable
                rotation={star.rotation}
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.6}
                shadowOffsetX={star.isDragging ? 10 : 5}
                shadowOffsetY={star.isDragging ? 10 : 5}
                scaleX={star.isDragging ? 1.2 : 1}
                scaleY={star.isDragging ? 1.2 : 1}
                onDragStart={props.handleDragStart}
                onDragEnd={props.handleDragEnd}
              />
            ))}
          </Layer>
        </Stage>
        </>
    )

}