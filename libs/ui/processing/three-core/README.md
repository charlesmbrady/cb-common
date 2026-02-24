# ui-processing-three-core

Reusable Three.js building blocks for app subscenes.

## Included primitives

- `BasicUnit`: simple cube mesh class for quick units.
- `BasicPhysicsScene`: helper that creates common scene objects (lights, grid, ground).
- `BasicR3FPhysicsSceneTemplate`: shared React Three Fiber template with Canvas + physics + ground.

## Quick usage

```ts
import { BasicUnit, BasicPhysicsScene } from '@cb-common/ui-processing-three-core';

const sceneBuilder = new BasicPhysicsScene({ groundSize: 30 });
const sceneObjects = sceneBuilder.createSceneObjects();
const unit = new BasicUnit({ size: 1, position: [0, 2, 0], color: '#4fa3ff' });
```

```tsx
import { BasicR3FPhysicsSceneTemplate, BasicUnit } from '@cb-common/ui-processing-three-core';
import { RigidBody } from '@react-three/rapier';

const unit = new BasicUnit({ position: [0, 2, 0] });

export function MyScene() {
  return (
    <BasicR3FPhysicsSceneTemplate camera={{ position: [6, 5, 6], fov: 60 }}>
      <RigidBody colliders="cuboid">
        <primitive object={unit} />
      </RigidBody>
    </BasicR3FPhysicsSceneTemplate>
  );
}
```

## Creating a new scene quickly

1. Use `BasicR3FPhysicsSceneTemplate` for baseline Canvas + physics setup.
2. Instantiate one or more `BasicUnit` objects (or your own unit classes).
3. Add your controls component (orbit/fps/etc).
4. Iterate by changing scene children/config only.
