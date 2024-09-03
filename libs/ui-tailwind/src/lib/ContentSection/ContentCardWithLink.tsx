// src/components/ContentCardWithLink.tsx
import React from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon'; // Importing the SVG icon as a separate component

interface ContentCardWithLinkProps {
  title: string;
  description: string;
  linkText: string;
  onLinkClick: () => void;
}

const ContentCardWithLink: React.FC<ContentCardWithLinkProps> = ({ title, description, linkText, onLinkClick }) => {
  return (
    <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
      <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">{title}</h2>
      <p className="leading-relaxed text-base mb-4">{description}</p>
      <a className="text-indigo-500 inline-flex items-center cursor-pointer" onClick={onLinkClick}>
        {linkText}
        <ArrowRightIcon className="w-4 h-4 ml-2" />
      </a>
    </div>
  );
};

export default ContentCardWithLink;
