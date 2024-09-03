// src/components/SectionHeader.tsx
import React from 'react';

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ subtitle, title, description }) => {
  return (
    <div className="flex flex-col text-center w-full mb-20">
      {subtitle && <h2 className="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">{subtitle}</h2>}
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{title}</h1>
      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">{description}</p>
    </div>
  );
};

export default SectionHeader;
