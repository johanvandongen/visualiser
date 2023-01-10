import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Star, Text } from 'react-konva';
import {COLORS} from '../colors.js'
import GraphArea from "./GraphArea"
import SideMenuGraph from "./SideMenuGraph.js";
import { visStyle, sideMenuStyle } from "../App.js";

function generateShapes(width, height) {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * width,
    y: Math.random() * height,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

export default function GraphVisualisation() {
  
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const demoRef = useRef();
  
  const [stars, setStars] = useState([]);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id,
        };
      })
    );
  };
  const handleDragEnd = (e) => {
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        };
      })
    );
  };

  // Handles canvas size to fit in the parent div
  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setWidth(event[0].contentBoxSize[0].inlineSize);
      setHeight(event[0].contentBoxSize[0].blockSize);
    });

    if (demoRef) {
      resizeObserver.observe(demoRef.current);
    }
  }, [demoRef]);

  useEffect(() => {
    setStars(generateShapes(width, height))
  }, [width, height])

  return (
    <div style={{display: "flex"}}>
      
      <div ref={demoRef} style={visStyle}>
        <GraphArea width={width} height={height} handleDragEnd={handleDragEnd} handleDragStart={handleDragStart} stars={stars}/>
      </div>
      
      <div style={sideMenuStyle}>
        <SideMenuGraph/>
      </div>
    </div>
  );

}