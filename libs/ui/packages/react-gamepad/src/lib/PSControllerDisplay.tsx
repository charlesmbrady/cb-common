import React from 'react';
import { GamepadState } from './GamepadProvider';
import { useTheme } from '@mui/material/styles';

export interface PSControllerDisplayProps {
  gamepad: GamepadState;
}

const faceButtonLabels = ['◯', '✖', '□', '▲'];

export const PSControllerDisplay: React.FC<PSControllerDisplayProps> = ({
  gamepad,
}) => {
  const theme = useTheme();
  // Mapping assumes standard mapping for PS controllers in Chrome.
  const faceButtonIndices = [1, 0, 2, 3]; // circle, cross, square, triangle
  const isPressed = (index: number) => gamepad.buttons[index]?.pressed;
  return (
    <svg
      width="250"
      height="120"
      viewBox="0 0 250 120"
      style={{ maxWidth: '100%' }}
    >
      {/* Controller body */}
      <rect
        x="10"
        y="20"
        rx="12"
        ry="12"
        width="230"
        height="80"
        fill={theme.palette.grey[800]}
      />
      {/* Face buttons */}
      {faceButtonIndices.map((idx, i) => {
        const cx = 190 + (i === 2 ? -20 : i === 3 ? 0 : i === 0 ? 20 : 0);
        const cy = 60 + (i === 3 ? -20 : i === 0 ? 0 : i === 1 ? 20 : 0);
        return (
          <g key={idx}>
            <circle
              cx={cx}
              cy={cy}
              r={15}
              fill={isPressed(idx) ? theme.palette.primary.main : '#333'}
              stroke="#888"
              strokeWidth="2"
            />
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fontSize="14"
              fill={theme.palette.primary.contrastText}
            >
              {faceButtonLabels[i]}
            </text>
          </g>
        );
      })}
      {/* D-Pad arrows */}
      {[
        { idx: 12, label: '▲', cx: 70, cy: 40 }, // Up
        { idx: 13, label: '▼', cx: 70, cy: 80 }, // Down
        { idx: 14, label: '◀', cx: 50, cy: 60 }, // Left
        { idx: 15, label: '▶', cx: 90, cy: 60 }, // Right
      ].map(({ idx, label, cx, cy }) => (
        <g key={idx}>
          <circle
            cx={cx}
            cy={cy}
            r={12}
            fill={isPressed(idx) ? theme.palette.primary.main : '#333'}
          />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fontSize="10"
            fill={theme.palette.primary.contrastText}
          >
            {label}
          </text>
        </g>
      ))}
      {/* Shoulder buttons L1/L2/R1/R2 */}
      {[
        { idx: 4, x: 30, y: 15, label: 'L1' },
        { idx: 6, x: 30, y: 5, label: 'L2' },
        { idx: 5, x: 190, y: 15, label: 'R1' },
        { idx: 7, x: 190, y: 5, label: 'R2' },
      ].map(({ idx, x, y, label }) => (
        <rect
          key={idx}
          x={x}
          y={y}
          width={30}
          height={6}
          rx={2}
          fill={isPressed(idx) ? theme.palette.primary.main : '#444'}
        />
      ))}
      {/* Options and Share buttons */}
      {[
        { idx: 9, cx: 125, cy: 50, label: 'OPT' }, // options
        { idx: 8, cx: 125, cy: 70, label: 'SHR' }, // share
      ].map(({ idx, cx, cy, label }) => (
        <g key={idx}>
          <rect
            x={cx - 15}
            y={cy - 6}
            width={30}
            height={12}
            rx={3}
            fill={isPressed(idx) ? theme.palette.primary.main : '#333'}
            stroke="#666"
            strokeWidth="1"
          />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fontSize="6"
            fill={theme.palette.primary.contrastText}
          >
            {label}
          </text>
        </g>
      ))}
      {/* Joysticks */}
      {[
        { idx: 10, cx: 70, cy: 100, axX: 0, axY: 1 }, // left stick click
        { idx: 11, cx: 180, cy: 100, axX: 2, axY: 3 }, // right stick click
      ].map(({ idx, cx, cy, axX, axY }) => {
        const maxOffset = 8; // within outer 18 radius
        const dx = (gamepad.axes[axX] || 0) * maxOffset;
        const dy = (gamepad.axes[axY] || 0) * maxOffset;
        return (
          <g key={idx}>
            <circle
              cx={cx}
              cy={cy}
              r={18}
              fill="#222"
              stroke="#666"
              strokeWidth="2"
            />
            <circle
              cx={cx + dx}
              cy={cy + dy}
              r={6}
              fill={isPressed(idx) ? theme.palette.primary.main : '#444'}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default PSControllerDisplay;
