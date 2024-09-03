// src/components/ContentCard.tsx
import React from 'react';

interface ContentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ icon, title, description }) => {
  return (
    <div className="xl:w-1/3 md:w-1/2 p-4">
      <div className="border border-gray-200 p-6 rounded-lg">
        <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
          {icon}
        </div>
        <h2 className="text-lg text-gray-900 font-medium title-font mb-2">{title}</h2>
        <p className="leading-relaxed text-base">{description}</p>
      </div>
    </div>
  );
};

export default ContentCard;
