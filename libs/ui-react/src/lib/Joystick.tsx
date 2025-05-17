import React, { useRef, useState } from 'react';
import styles from './Joystick.module.css';

export interface JoystickProps {
  onMove?: (x: number, y: number) => void;
  label?: string;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove, label }) => {
  const size = 80;
  const knobSize = 32;
  const radius = (size - knobSize) / 2;
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    setPos({ x: 0, y: 0 });
    onMove?.(0, 0);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const boundingRect = (e.target as HTMLElement).getBoundingClientRect();
    const cx = boundingRect.left + boundingRect.width / 2;
    const cy = boundingRect.top + boundingRect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dragDistance = Math.sqrt(dx * dx + dy * dy);
    if (dragDistance > radius) {
      dx = (dx / dragDistance) * radius;
      dy = (dy / dragDistance) * radius;
    }
    setPos({ x: dx, y: dy });
    onMove?.(dx / radius, dy / radius);
  };
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '1px solid #ccc',
        borderRadius: '50%',
        position: 'relative',
        touchAction: 'none',
        background: '#fafafa',
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Centered label if provided */}
      {label && (
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: 22,
            color: '#888',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${pos.x - knobSize / 2}px)`,
          top: `calc(50% + ${pos.y - knobSize / 2}px)`,
          width: knobSize,
          height: knobSize,
          background: '#eee',
          border: '1px solid #ccc',
          borderRadius: '50%',
          cursor: 'pointer',
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
      />
    </div>
  );
};

export default Joystick;
