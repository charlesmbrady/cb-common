// src/components/icons/ArrowRightIcon.tsx
import React from 'react';

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14M12 5l7 7-7 7"></path>
    </svg>
  );
};

export default ArrowRightIcon;
