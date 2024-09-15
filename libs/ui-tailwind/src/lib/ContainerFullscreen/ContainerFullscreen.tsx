// src/components/Container.tsx
import React from 'react';

export function ContainerFullscreen({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <div className="w-screen h-screen flex flex-col">{children}</div>;
}
