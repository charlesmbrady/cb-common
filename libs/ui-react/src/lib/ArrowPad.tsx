import React from 'react';
import { ControllerButton } from './ControllerButton';

export interface ArrowPadProps {
  onArrow?: (dir: string) => void;
}

export const ArrowPad: React.FC<ArrowPadProps> = ({ onArrow }) => (
  <div
    className="arrow-pad"
    style={{
      display: 'grid',
      gridTemplateRows: 'repeat(3, 1fr)',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 2,
      width: 96,
      height: 96,
      placeItems: 'center',
    }}
  >
    <div />
    <ControllerButton
      shape="square"
      label="↑"
      onClick={() => onArrow?.('up')}
    />
    <div />
    <ControllerButton
      shape="square"
      label="←"
      onClick={() => onArrow?.('left')}
    />
    <div />
    <ControllerButton
      shape="square"
      label="→"
      onClick={() => onArrow?.('right')}
    />
    <div />
    <ControllerButton
      shape="square"
      label="↓"
      onClick={() => onArrow?.('down')}
    />
    <div />
  </div>
);

export default ArrowPad;
