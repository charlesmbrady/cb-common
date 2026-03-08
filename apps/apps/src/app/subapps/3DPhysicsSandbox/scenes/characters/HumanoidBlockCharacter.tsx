import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import {
  ActionName,
  CHARACTER_MOTION,
  CharacterMode,
  KEY_BINDINGS,
  MoveState,
  findClipByName,
} from './humanoidTypes';
import {
  HUMANOID_BLOCK_RIG,
  RagdollController,
  RagdollPhysicsNodes,
} from './ragdoll';

const MODEL_URL = new URL(
  '../../models/humanoid_block.glb',
  import.meta.url
).toString();

const TURN_SPEED = Math.PI * 1.9;
const MODEL_FORWARD_VECTOR = new THREE.Vector3(0, 0, -1);

export default function HumanoidBlockCharacter() {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const ragdollControllerRef = useRef<RagdollController>(
    new RagdollController(HUMANOID_BLOCK_RIG)
  );
  const ragdollBodyRefs = useRef(
    Object.fromEntries(
      HUMANOID_BLOCK_RIG.bodies.map((body) => [
        body.bone,
        { current: null as RapierRigidBody | null },
      ])
    ) as Record<string, React.MutableRefObject<RapierRigidBody | null>>
  );
  const actionsRef = useRef<Partial<Record<ActionName, THREE.AnimationAction>>>(
    {}
  );
  const modeRef = useRef<CharacterMode>('animated');
  const currentActionRef = useRef<ActionName | null>(null);
  const moveStateRef = useRef<MoveState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
  });
  const verticalVelocityRef = useRef(0);
  const isGroundedRef = useRef(true);
  const physicsRootPosition = useRef(new THREE.Vector3());
  const physicsRootRotation = useRef(new THREE.Quaternion());

  const setAnimationPaused = (paused: boolean) => {
    for (const action of Object.values(actionsRef.current)) {
      if (!action) continue;
      action.paused = paused;
    }
  };

  const fadeToAction = (nextAction: ActionName, duration = 0.15) => {
    if (currentActionRef.current === nextAction) return;

    const next = actionsRef.current[nextAction];
    if (!next) return;

    const prevName = currentActionRef.current;
    const prev = prevName ? actionsRef.current[prevName] : undefined;

    prev?.fadeOut(duration);
    next.reset().fadeIn(duration).play();
    currentActionRef.current = nextAction;
  };

  const playAttack = () => {
    const attack = actionsRef.current.attack;
    if (!attack) return;

    const idle = actionsRef.current.idle;
    const walk = actionsRef.current.walk;
    const run = actionsRef.current.run;

    attack.reset();
    attack.setLoop(THREE.LoopOnce, 1);
    attack.clampWhenFinished = true;
    attack.fadeIn(0.06).play();
    currentActionRef.current = 'attack';

    const onFinish = () => {
      attack.fadeOut(0.08);
      if (
        run &&
        moveStateRef.current.run &&
        (moveStateRef.current.forward ||
          moveStateRef.current.backward ||
          moveStateRef.current.left ||
          moveStateRef.current.right)
      ) {
        run.reset().fadeIn(0.08).play();
        currentActionRef.current = 'run';
      } else if (
        walk &&
        (moveStateRef.current.forward ||
          moveStateRef.current.backward ||
          moveStateRef.current.left ||
          moveStateRef.current.right)
      ) {
        walk.reset().fadeIn(0.08).play();
        currentActionRef.current = 'walk';
      } else if (idle) {
        idle.reset().fadeIn(0.1).play();
        currentActionRef.current = 'idle';
      }
      mixerRef.current?.removeEventListener('finished', onFinish);
    };

    mixerRef.current?.addEventListener('finished', onFinish);
  };

  const setCharacterMode = (nextMode: CharacterMode) => {
    const group = groupRef.current;

    if (nextMode === 'animated' && group) {
      group.position.copy(physicsRootPosition.current);
      group.quaternion.copy(physicsRootRotation.current);
      group.rotation.setFromQuaternion(group.quaternion);
      verticalVelocityRef.current = 0;
    }

    modeRef.current = nextMode;
    ragdollControllerRef.current.setMode(nextMode);

    if (nextMode === 'physics') {
      setAnimationPaused(true);
      return;
    }

    setAnimationPaused(false);
    if (!currentActionRef.current && actionsRef.current.idle) {
      actionsRef.current.idle.reset().fadeIn(0.12).play();
      currentActionRef.current = 'idle';
    }
  };

  useEffect(() => {
    ragdollControllerRef.current.registerBodyRefs(ragdollBodyRefs.current);

    let active = true;
    const loader = new GLTFLoader();

    loader.load(
      MODEL_URL,
      (gltf) => {
        if (!active) return;
        const cloned = clone(gltf.scene) as THREE.Object3D;
        cloned.position.set(0, 0, 0);
        cloned.scale.setScalar(1.5);
        cloned.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        const mixer = new THREE.AnimationMixer(cloned);
        mixerRef.current = mixer;

        const clips = gltf.animations;
        const idleClip =
          findClipByName(clips, [/idle/, /breath/, /stand/]) ?? clips[0];
        const walkClip = findClipByName(clips, [/walk/]);
        const runClip = findClipByName(clips, [/run/, /sprint/]);
        const jumpClip = findClipByName(clips, [/jump/]);
        const attackClip = findClipByName(clips, [/slash/, /attack/, /hit/]);

        actionsRef.current.idle = idleClip
          ? mixer.clipAction(idleClip)
          : undefined;
        actionsRef.current.walk = walkClip
          ? mixer.clipAction(walkClip)
          : undefined;
        actionsRef.current.run = runClip
          ? mixer.clipAction(runClip)
          : undefined;
        actionsRef.current.jump = jumpClip
          ? mixer.clipAction(jumpClip)
          : undefined;
        actionsRef.current.attack = attackClip
          ? mixer.clipAction(attackClip)
          : undefined;

        actionsRef.current.idle?.play();
        currentActionRef.current = actionsRef.current.idle ? 'idle' : null;

        ragdollControllerRef.current.initializeFromModel(cloned);
        ragdollControllerRef.current.setMode(modeRef.current);

        setModel(cloned);
      },
      undefined,
      () => {
        if (!active) return;
        setModel(null);
      }
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === KEY_BINDINGS.moveForward)
        moveStateRef.current.forward = true;
      if (event.code === KEY_BINDINGS.moveBackward)
        moveStateRef.current.backward = true;
      if (event.code === KEY_BINDINGS.moveLeft)
        moveStateRef.current.left = true;
      if (event.code === KEY_BINDINGS.moveRight)
        moveStateRef.current.right = true;
      if (
        event.code === KEY_BINDINGS.run ||
        event.code === KEY_BINDINGS.runAlt
      ) {
        moveStateRef.current.run = true;
      }

      if (event.code === KEY_BINDINGS.togglePhysics) {
        const nextMode = ragdollControllerRef.current.toggleMode();
        setCharacterMode(nextMode);
      }

      if (
        event.code === KEY_BINDINGS.jump &&
        isGroundedRef.current &&
        modeRef.current === 'animated'
      ) {
        verticalVelocityRef.current = CHARACTER_MOTION.jumpVelocity;
        isGroundedRef.current = false;
        const jumpAction = actionsRef.current.jump;
        if (jumpAction) {
          jumpAction.reset();
          jumpAction.setLoop(THREE.LoopOnce, 1);
          jumpAction.clampWhenFinished = true;
          jumpAction.fadeIn(0.05).play();
          currentActionRef.current = 'jump';
        }
      }

      if (event.code === KEY_BINDINGS.slash) {
        if (modeRef.current === 'animated') {
          playAttack();
        }

        const group = groupRef.current;
        if (group) {
          const forward = MODEL_FORWARD_VECTOR.clone()
            .applyQuaternion(group.quaternion)
            .setY(0)
            .normalize();
          ragdollControllerRef.current.applyHitReaction({
            targetBone: 'upper_spine',
            direction: forward,
            strength: 0.1,
            localize: true,
          });
          setCharacterMode('physics');
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === KEY_BINDINGS.moveForward)
        moveStateRef.current.forward = false;
      if (event.code === KEY_BINDINGS.moveBackward)
        moveStateRef.current.backward = false;
      if (event.code === KEY_BINDINGS.moveLeft)
        moveStateRef.current.left = false;
      if (event.code === KEY_BINDINGS.moveRight)
        moveStateRef.current.right = false;
      if (
        event.code === KEY_BINDINGS.run ||
        event.code === KEY_BINDINGS.runAlt
      ) {
        moveStateRef.current.run = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      active = false;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      mixerRef.current?.stopAllAction();
      mixerRef.current = null;
    };
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const mixer = mixerRef.current;
    if (modeRef.current === 'animated') {
      mixer?.update(delta);
      ragdollControllerRef.current.syncBodiesFromAnimation();
    }

    const turnInput =
      (moveStateRef.current.right ? 1 : 0) -
      (moveStateRef.current.left ? 1 : 0);
    const forwardInput =
      (moveStateRef.current.forward ? 1 : 0) -
      (moveStateRef.current.backward ? 1 : 0);
    const moving = forwardInput !== 0;

    if (modeRef.current === 'animated') {
      if (turnInput !== 0) {
        group.rotation.y -= turnInput * TURN_SPEED * delta;
      }

      if (forwardInput !== 0) {
        const forwardDirection = MODEL_FORWARD_VECTOR.clone()
          .applyQuaternion(group.quaternion)
          .setY(0)
          .normalize();

        const speed = moveStateRef.current.run
          ? CHARACTER_MOTION.runSpeed
          : CHARACTER_MOTION.walkSpeed;

        group.position.addScaledVector(
          forwardDirection,
          forwardInput * speed * delta
        );
      }
    }

    if (modeRef.current === 'animated') {
      verticalVelocityRef.current -= CHARACTER_MOTION.gravity * delta;
      group.position.y += verticalVelocityRef.current * delta;
      if (group.position.y <= 0) {
        group.position.y = 0;
        verticalVelocityRef.current = 0;
        isGroundedRef.current = true;
      }
    } else {
      ragdollControllerRef.current.update({ delta, floorY: 0 });

      const rootTransform = ragdollControllerRef.current.getRootBodyTransform();
      if (rootTransform) {
        physicsRootPosition.current.copy(rootTransform.position);
        physicsRootRotation.current.copy(rootTransform.rotation);

        group.position.copy(rootTransform.position);
        group.quaternion.copy(rootTransform.rotation);
      }
    }

    if (
      modeRef.current === 'animated' &&
      currentActionRef.current !== 'attack' &&
      currentActionRef.current !== 'jump'
    ) {
      if (!moving) {
        fadeToAction('idle');
      } else if (moveStateRef.current.run && actionsRef.current.run) {
        fadeToAction('run');
      } else if (actionsRef.current.walk) {
        fadeToAction('walk');
      } else {
        fadeToAction('idle');
      }
    }
  });

  if (!model) return null;
  return (
    <group ref={groupRef}>
      <primitive object={model} />
      <RagdollPhysicsNodes
        rig={HUMANOID_BLOCK_RIG}
        bodyRefs={ragdollBodyRefs.current}
        enableJoints
      />
    </group>
  );
}
