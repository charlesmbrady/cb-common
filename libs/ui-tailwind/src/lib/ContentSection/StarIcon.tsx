// src/components/ActionButton.tsx
import React from 'react';

const StarIcon: React.FC = () => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      className="w-6 h-6"
      viewBox="0 0 24 24"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  );
};

export default StarIcon;
