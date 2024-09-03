// src/components/ContactSection.tsx
import React from 'react';
import SectionHeader from '../ContentSection/SectionHeader';
import ContactForm from './ContactForm';
import SocialIcons from './SocialIcons';

interface ContactSectionProps {
  title: string;
  description: string;
  onFormSubmit: (formData: { name: string; email: string; message: string }) => void;
  buttonText: string;
  email: string;
  address: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export function ContactSection({
  title,
  description,
  onFormSubmit,
  buttonText,
  email,
  address,
  facebookUrl,
  twitterUrl,
  instagramUrl,
  linkedinUrl,
  githubUrl,
}: ContactSectionProps) {
  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto">
        <SectionHeader title={title} description={description} />
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <ContactForm onSubmit={onFormSubmit} buttonText={buttonText} />
          <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
            <a href={`mailto:${email}`} className="text-indigo-500">
              {email}
            </a>
            <p className="leading-normal my-5">
              {address.split('\n').map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </p>
            <SocialIcons
              facebookUrl={facebookUrl}
              twitterUrl={twitterUrl}
              instagramUrl={instagramUrl}
              linkedinUrl={linkedinUrl}
              githubUrl={githubUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
