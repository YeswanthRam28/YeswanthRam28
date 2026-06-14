import React, { useEffect, useState } from 'react';
import useSceneStore from '../store/useSceneStore';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const hoveredObject = useSceneStore(state => state.hoveredObject);

  useEffect(() => {
    let animationFrameId;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updateCursor = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      setPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      id="custom-cursor" 
      className={hoveredObject ? 'hovering' : ''}
      style={{ left: position.x, top: position.y }}
    ></div>
  );
}
