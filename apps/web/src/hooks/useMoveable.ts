import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

const useMovable = (childId: string): { position: Position; isDragging: boolean } => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const childElement = document.getElementById(childId);
    if (!childElement) return;

    const parentElement = childElement.parentElement;
    if (!parentElement) return;

    const handleMouseDown = (event: MouseEvent) => {
      setIsDragging(true);
      setDragOffset({
        x: event.clientX - childElement.offsetLeft,
        y: event.clientY - childElement.offsetTop,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const newX = event.clientX - dragOffset.x;
        const newY = event.clientY - dragOffset.y;

        setPosition({ x: newX, y: newY });

        // Apply new position to the child element
        childElement.style.left = `${newX}px`;
        childElement.style.top = `${newY}px`;
      }
    };

    childElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      childElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [childId, dragOffset.x, dragOffset.y, isDragging]);

  return { position, isDragging };
};

export default useMovable;
