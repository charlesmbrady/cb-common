import React from 'react';
import {
  BallCollider,
  CapsuleCollider,
  CuboidCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
  useRevoluteJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import type {
  RagdollBodyDefinition,
  RagdollBoneName,
  RagdollJointDefinition,
  RagdollRigDefinition,
} from './RagdollRigDefinition';

type BodyRefMap = Partial<
  Record<RagdollBoneName, React.MutableRefObject<RapierRigidBody | null>>
>;

function BoneCollider({ body }: { body: RagdollBodyDefinition }) {
  const size = body.collider.size;

  if (body.collider.type === 'box') {
    return <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />;
  }

  if (body.collider.type === 'sphere') {
    return <BallCollider args={[size[0]]} />;
  }

  return <CapsuleCollider args={[size[1] / 2, size[0]]} />;
}

function SphericalJointNode({
  joint,
  parentRef,
  childRef,
}: {
  joint: RagdollJointDefinition;
  parentRef: React.MutableRefObject<RapierRigidBody | null>;
  childRef: React.MutableRefObject<RapierRigidBody | null>;
}) {
  useSphericalJoint(parentRef, childRef, [
    joint.anchorParent,
    joint.anchorChild,
  ]);
  return null;
}

function RevoluteJointNode({
  joint,
  parentRef,
  childRef,
}: {
  joint: RagdollJointDefinition;
  parentRef: React.MutableRefObject<RapierRigidBody | null>;
  childRef: React.MutableRefObject<RapierRigidBody | null>;
}) {
  useRevoluteJoint(parentRef, childRef, [
    joint.anchorParent,
    joint.anchorChild,
    [1, 0, 0],
    [joint.limits.swingX[0], joint.limits.swingX[1]],
  ]);
  return null;
}

function isHingeJoint(joint: RagdollJointDefinition) {
  return (
    joint.child.includes('lower_arm') ||
    joint.child.includes('lower_leg') ||
    joint.child.includes('foot')
  );
}

export function RagdollPhysicsNodes({
  rig,
  bodyRefs,
  enableJoints = false,
}: {
  rig: RagdollRigDefinition;
  bodyRefs: BodyRefMap;
  enableJoints?: boolean;
}) {
  return (
    <>
      {rig.bodies.map((body) => {
        const bodyRef = bodyRefs[body.bone];
        if (!bodyRef) return null;

        return (
          <RigidBody
            key={`ragdoll-body-${body.bone}`}
            ref={bodyRef}
            type="kinematicPosition"
            colliders={false}
            position={[0, 0, 0]}
            linearDamping={body.damping.linear}
            angularDamping={body.damping.angular}
            mass={body.mass}
            collisionGroups={interactionGroups(1, [0])}
            solverGroups={interactionGroups(1, [0])}
            canSleep
          >
            <BoneCollider body={body} />
          </RigidBody>
        );
      })}

      {enableJoints &&
        rig.joints.map((joint) => {
          const parentRef = bodyRefs[joint.parent];
          const childRef = bodyRefs[joint.child];
          if (!parentRef || !childRef) return null;

          if (isHingeJoint(joint)) {
            return (
              <RevoluteJointNode
                key={`ragdoll-joint-hinge-${joint.parent}-${joint.child}`}
                joint={joint}
                parentRef={parentRef}
                childRef={childRef}
              />
            );
          }

          return (
            <SphericalJointNode
              key={`ragdoll-joint-spherical-${joint.parent}-${joint.child}`}
              joint={joint}
              parentRef={parentRef}
              childRef={childRef}
            />
          );
        })}
    </>
  );
}

export default RagdollPhysicsNodes;
