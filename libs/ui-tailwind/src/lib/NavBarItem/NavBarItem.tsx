// src/components/NavBarItem.tsx
import React from 'react';

interface NavBarItemProps {
  label: string;
  href: string;
}

export function NavBarItem({ label, href }: NavBarItemProps): JSX.Element {
  return (
    <a href={href} className="text-black hover:text-gray-300 px-3 py-2">
      {label}
    </a>
  );
}
