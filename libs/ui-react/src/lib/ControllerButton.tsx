import React, { useState } from 'react';
import styles from './ControllerButton.module.css';

export type ControllerButtonVariant = 'flat' | 'rounded';
export type ControllerButtonShape =
  | 'rectangle'
  | 'circle'
  | 'square'
  | 'default';

export interface ControllerButtonProps {
  label: string;
  onClick?: () => void;
  variant?: ControllerButtonVariant;
  active?: boolean;
  style?: React.CSSProperties;
  shape?: ControllerButtonShape;
}

export const ControllerButton: React.FC<ControllerButtonProps> = ({
  label,
  onClick,
  variant = 'flat',
  active = false,
  style,
  shape = 'default',
}) => {
  const [pressed, setPressed] = useState(false);
  const isActive = pressed || active;
  let borderRadius = 6;
  let buttonWidth = 48;
  let buttonHeight = 48;
  if (shape === 'circle') {
    borderRadius = 999;
    buttonWidth = 48;
    buttonHeight = 48;
  } else if (shape === 'square') {
    borderRadius = 8;
    buttonWidth = 48;
    buttonHeight = 48;
  } else if (shape === 'rectangle') {
    borderRadius = 8;
    buttonWidth = 72;
    buttonHeight = 40;
  }
  return (
    <button
      className={styles.button}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
      style={{
        border: '1px solid #aaa',
        borderRadius,
        background: isActive ? '#e0e0e0' : '#fafafa',
        boxShadow:
          variant === 'rounded'
            ? isActive
              ? 'inset 2px 2px 6px #bbb, inset -2px -2px 6px #fff'
              : '2px 2px 6px #bbb, -2px -2px 6px #fff'
            : undefined,
        fontWeight: 'bold',
        fontSize: 16,
        margin: 4,
        minWidth: buttonWidth,
        minHeight: buttonHeight,
        width: buttonWidth,
        height: buttonHeight,
        outline: isActive ? '2px solid #888' : undefined,
        transition: 'box-shadow 0.1s, background 0.1s',
        ...style,
      }}
      aria-pressed={isActive}
    >
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default ControllerButton;
