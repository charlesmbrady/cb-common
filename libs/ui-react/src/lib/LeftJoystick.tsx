import React from 'react';
import { Joystick } from './Joystick';

export interface LeftJoystickProps {
  onMove?: (x: number, y: number) => void;
}

export const LeftJoystick: React.FC<LeftJoystickProps> = ({ onMove }) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
  >
    <Joystick onMove={onMove} />
    <span style={{ marginTop: 4, fontWeight: 'bold', fontSize: 14 }}>L</span>
  </div>
);

export default LeftJoystick;
