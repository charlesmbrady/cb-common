// src/components/Container.tsx
import React from 'react';

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="w-screen h-screen flex flex-col">{children}</div>;
};

export default Container;
