// @cb-common/ui-tailwind/NavBar.tsx
import { HTMLAttributeAnchorTarget, useState } from 'react';

interface NavBarProps {
  brandName: string;
  links?: NavLink[];
}

export type NavLink = {
  target?: HTMLAttributeAnchorTarget | undefined;
  label: string;
  href: string;
};

export function NavBar({ brandName, links }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div>
            <a href="/" className="flex items-center py-4 px-2">
              <span className="font-bold text-xl text-indigo-500">
                {brandName}
              </span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {links?.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.target}
                className="py-4 px-2 text-gray-500 hover:text-indigo-500 transition duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="mobile-menu md:hidden">
          {links?.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.target}
              className="block py-2 px-4 text-sm hover:bg-gray-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
