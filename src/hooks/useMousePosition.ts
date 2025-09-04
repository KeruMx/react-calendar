import React from "react";

export const useMousePosition = () => {
    const [
      mousePosition,
      setMousePosition
    ] = React.useState({ x: null, y: null });
    const { log } = console;
    React.useEffect(() => {
      const updateMousePosition = (ev: { clientX: any; clientY: any; }) => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
      };
      
      window.addEventListener('mousemove', updateMousePosition);
  
      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
      };
    }, []);
  
    return mousePosition;
  };