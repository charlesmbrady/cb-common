// src/components/NavbarItem.tsx
import React from 'react';

interface NavbarItemProps {
  label: string;
  href: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ label, href }) => {
  return (
    <a href={href} className="text-black hover:text-gray-300 px-3 py-2">
      {label}
    </a>
  );
};

export default NavbarItem;
