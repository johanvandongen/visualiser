import { useState, useEffect } from "react";

/**
 * Handles canvas size to fit in the parent div
 * 
 * @param {*} demoRef 
 * @returns width, height
 */
export function useWidthHeight(demoRef) {
    
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((event) => {
            setWidth(event[0].contentBoxSize[0].inlineSize);
            setHeight(event[0].contentBoxSize[0].blockSize);
        });

        if (demoRef) {
            resizeObserver.observe(demoRef.current);
        }
    }, [demoRef]);
    
    return [width, height]
}
