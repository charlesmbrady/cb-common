import * as THREE from 'three';

export type ActionName = 'idle' | 'walk' | 'run' | 'jump' | 'attack';
export type CharacterMode = 'animated' | 'physics';

export type MoveState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
};

export const KEY_BINDINGS = {
  moveForward: 'KeyW',
  moveBackward: 'KeyS',
  moveLeft: 'KeyA',
  moveRight: 'KeyD',
  run: 'ShiftLeft',
  runAlt: 'ShiftRight',
  togglePhysics: 'KeyT',
  jump: 'Space',
  slash: 'KeyQ',
} as const;

export const CHARACTER_MOTION = {
  gravity: 9.81,
  jumpVelocity: 7.5,
  walkSpeed: 2.2,
  runSpeed: 4.4,
};

export function findClipByName(
  clips: THREE.AnimationClip[],
  regexes: RegExp[]
) {
  return clips.find((clip) =>
    regexes.some((regex) => regex.test(clip.name.toLowerCase()))
  );
}
