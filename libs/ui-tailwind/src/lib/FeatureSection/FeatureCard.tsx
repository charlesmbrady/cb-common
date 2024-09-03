// @cb-common/ui-tailwind/FeatureCard.tsx
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="p-4 md:w-1/3">
      <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center p-6">
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d={icon} />
            </svg>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">{title}</h2>
          <p className="leading-relaxed text-base">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
