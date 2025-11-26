import { useGamepadContext } from './GamepadProvider';

export function useGamepad(index = 0) {
  const { gamepads } = useGamepadContext();
  return gamepads[index] || null;
}
