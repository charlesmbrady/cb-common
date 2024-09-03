// src/components/ContentSectionWithLink.tsx
import React from 'react';
import SectionHeader from './SectionHeader';
import ContentCardWithLink from './ContentCardWithLink';
import ActionButton from './ActionButton';

interface ContentSectionWithLinkProps {
  subtitle: string;
  title: string;
  description: string;
  cards: {
    title: string;
    description: string;
    linkText: string;
    onLinkClick: () => void;
  }[];
  buttonText: string;
  onButtonClick: () => void;
}

const ContentSectionWithLink: React.FC<ContentSectionWithLinkProps> = ({
  subtitle,
  title,
  description,
  cards,
  buttonText,
  onButtonClick,
}) => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <SectionHeader title={title} description={description} subtitle={subtitle} />
        <div className="flex flex-wrap">
          {cards.map((card, index) => (
            <ContentCardWithLink
              key={index}
              title={card.title}
              description={card.description}
              linkText={card.linkText}
              onLinkClick={card.onLinkClick}
            />
          ))}
        </div>
        <ActionButton text={buttonText} onClick={onButtonClick} />
      </div>
    </section>
  );
};

export default ContentSectionWithLink;
