export function attachKeyboardControls(controls, target = document) {
  const handleKey = (isDown) => (event) => {
    let handled = true;
    switch (event.key) {
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
    if (handled) {
      event.preventDefault();
    }
  };

  const onKeyDown = handleKey(true);
  const onKeyUp = handleKey(false);
  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);

  return () => {
    target.removeEventListener('keydown', onKeyDown);
    target.removeEventListener('keyup', onKeyUp);
  };
}
