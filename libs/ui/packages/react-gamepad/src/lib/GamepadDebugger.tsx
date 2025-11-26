import React from 'react';
import { useGamepadContext } from './GamepadProvider';

export const GamepadDebugger: React.FC = () => {
  const { gamepads } = useGamepadContext();

  if (gamepads.length === 0) {
    return <div>No gamepads connected.</div>;
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: 16 }}>
      {gamepads.map((gp) => (
        <div
          key={gp.index}
          style={{
            marginBottom: 24,
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div>
            <strong>{gp.id}</strong> (index {gp.index})
          </div>
          <div>Mapping: {gp.mapping}</div>
          <div>Connected: {gp.connected ? 'Yes' : 'No'}</div>
          <div style={{ marginTop: 8 }}>
            <div>Buttons:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {gp.buttons.map((btn, i) => (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    background: btn.pressed ? '#4caf50' : '#eee',
                    color: btn.pressed ? '#fff' : '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    border: '1px solid #bbb',
                    fontWeight: btn.pressed ? 'bold' : 'normal',
                  }}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div>Axes:</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {gp.axes.map((axis, i) => (
                <div key={i} style={{ minWidth: 60 }}>
                  Axis {i}: {axis.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
