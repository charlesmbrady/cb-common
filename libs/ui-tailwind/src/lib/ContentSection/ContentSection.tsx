// @cb-common/ui-tailwind/ContentSection.tsx
import React from 'react';
import SectionHeader from './SectionHeader';
import ContentCard from './ContentCard';

interface ContentSectionProps {
  title: string;
  description: string;
  features?: { title: string; description: string; icon: React.ReactNode }[];
}

export function ContentSection({ title, description, features }: ContentSectionProps) {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <SectionHeader title={title} description={description} />
        {features && (
          <div className="flex flex-wrap -m-4">
            {features.map((feature, index) => (
              <ContentCard key={index} title={feature.title} description={feature.description} icon={feature.icon} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
