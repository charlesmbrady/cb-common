import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface GamepadButtonState {
  pressed: boolean;
  touched: boolean;
  value: number;
}

export interface GamepadState {
  id: string;
  index: number;
  buttons: GamepadButtonState[];
  axes: number[];
  mapping: string;
  connected: boolean;
}

interface GamepadContextValue {
  gamepads: GamepadState[];
}

const GamepadContext = createContext<GamepadContextValue>({ gamepads: [] });

export const GamepadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const rafRef = useRef<number>();

  const pollGamepads = () => {
    const rawGamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const mapped = Array.from(rawGamepads)
      .filter((g): g is Gamepad => !!g)
      .map((g) => ({
        id: g.id,
        index: g.index,
        buttons: g.buttons.map((b) => ({
          pressed: b.pressed,
          touched: b.touched,
          value: b.value,
        })),
        axes: [...g.axes],
        mapping: g.mapping,
        connected: g.connected,
      }));
    setGamepads(mapped);
    rafRef.current = requestAnimationFrame(pollGamepads);
  };

  useEffect(() => {
    const handleConnect = () => pollGamepads();
    const handleDisconnect = () => pollGamepads();
    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);
    // periodic poll to catch initial connection (some browsers need user gesture)
    pollGamepads();
    const intervalId = window.setInterval(() => {
      const pads = navigator.getGamepads
        ? Array.from(navigator.getGamepads()).filter(Boolean)
        : [];
      if (pads.length > 0) {
        setGamepads(
          pads.map((g) => ({
            id: g!.id,
            index: g!.index,
            buttons: g!.buttons.map((b) => ({
              pressed: b.pressed,
              touched: b.touched,
              value: b.value,
            })),
            axes: [...g!.axes],
            mapping: g!.mapping,
            connected: g!.connected,
          })) as GamepadState[]
        );
        window.clearInterval(intervalId);
      }
    }, 500);

    rafRef.current = requestAnimationFrame(pollGamepads);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
      window.clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GamepadContext.Provider value={{ gamepads }}>
      {children}
    </GamepadContext.Provider>
  );
};

export const useGamepadContext = () => useContext(GamepadContext);
