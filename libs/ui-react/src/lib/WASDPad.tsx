import React from 'react';
import { ControllerButton } from './ControllerButton';

export interface WASDPadProps {
  onWASD?: (key: string) => void;
}

export const WASDPad: React.FC<WASDPadProps> = ({ onWASD }) => (
  <div
    className="wasd-pad"
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
    <ControllerButton shape="square" label="W" onClick={() => onWASD?.('w')} />
    <div />
    <ControllerButton shape="square" label="A" onClick={() => onWASD?.('a')} />
    <div />
    <ControllerButton shape="square" label="D" onClick={() => onWASD?.('d')} />
    <div />
    <ControllerButton shape="square" label="S" onClick={() => onWASD?.('s')} />
    <div />
  </div>
);

export default WASDPad;
