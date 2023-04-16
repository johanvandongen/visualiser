import React, { useEffect, useRef } from "react";

export function usePlayPause(callback, delay) {
    const callbackRef = useRef()

    useEffect(() => {
        callbackRef.current = callback // Update ref to the latest callback.
      }, [callback])

    useEffect(() => {
        function cb() {
            callbackRef.current()
        }

        if (delay !== null) {
            const id = setInterval(cb, delay)
            return () => clearInterval(id)
        }
    }, [delay])

}