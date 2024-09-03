// src/components/SocialIcons.tsx
import React from 'react';
import FacebookIcon from './icons/FacebookIcon';
import TwitterIcon from './icons/TwitterIcon';
import InstagramIcon from './icons/InstagramIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import GithubIcon from './icons/GithubIcon';

interface SocialIconsProps {
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

const SocialIcons: React.FC<SocialIconsProps> = ({ facebookUrl, twitterUrl, instagramUrl, linkedinUrl, githubUrl }) => {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      {facebookUrl && (
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
          <FacebookIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </a>
      )}
      {twitterUrl && (
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
          <TwitterIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </a>
      )}
      {instagramUrl && (
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
          <InstagramIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </a>
      )}
      {linkedinUrl && (
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
          <LinkedInIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </a>
      )}
      {githubUrl && (
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          <GithubIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </a>
      )}
    </div>
  );
};

export default SocialIcons;
