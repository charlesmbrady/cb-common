/* ------------------------------------------------------------------ */
/*  Controls – simple boolean control state                            */
/* ------------------------------------------------------------------ */

export interface ControlState {
  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;
}

export function createControls(): ControlState {
  return { forward: false, left: false, right: false, reverse: false };
}

export function resetControls(c: ControlState): void {
  c.forward = false;
  c.left = false;
  c.right = false;
  c.reverse = false;
}

/**
 * Attaches arrow-key listeners to `target` and mutates `controls`.
 * Returns a cleanup function that removes the listeners.
 */
export function attachKeyboardControls(
  controls: ControlState,
  target: Pick<
    EventTarget,
    'addEventListener' | 'removeEventListener'
  > = document
): () => void {
  const handleKey = (isDown: boolean) => (event: Event) => {
    const key = (event as KeyboardEvent).key;
    let handled = true;
    switch (key) {
      case 'ArrowUp':
        controls.forward = isDown;
        break;
      case 'ArrowDown':
        controls.reverse = isDown;
        break;
      case 'ArrowLeft':
        controls.left = isDown;
        break;
      case 'ArrowRight':
        controls.right = isDown;
        break;
      default:
        handled = false;
        break;
    }
    if (handled) (event as KeyboardEvent).preventDefault();
  };

  const onKeyDown = handleKey(true);
  const onKeyUp = handleKey(false);
  target.addEventListener('keydown', onKeyDown as EventListener);
  target.addEventListener('keyup', onKeyUp as EventListener);

  return () => {
    target.removeEventListener('keydown', onKeyDown as EventListener);
    target.removeEventListener('keyup', onKeyUp as EventListener);
  };
}
