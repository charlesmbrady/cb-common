// pages/index.tsx
import React from 'react';
import './styles.css';
import Head from 'next/head';
import { NavBar } from '@cb-common/ui-tailwind';
import { HeroSection } from '@cb-common/ui-tailwind';
import { ContentSection } from '@cb-common/ui-tailwind';
import { ContactSection } from '@cb-common/ui-tailwind';
import {
  Code as FaCode,
  Sync as FaSync,
  StackedLineChart as FaChartLine,
  ExpandMoreSharp as FaExpandArrowsAlt,
} from '@mui/icons-material';

export default function Home() {
  const navLinks = [
    { label: 'What We Offer', href: '#what-we-offer' },
    { label: 'Our Approach', href: '#our-approach' },
    { label: 'Why Choose Us', href: '#why-choose-us' },
    { label: 'Get Started', href: '#get-started' },
  ];

  const whatWeOfferFeatures = [
    {
      title: 'Automated Website Development',
      description:
        'We build and deploy modern, responsive websites using Next.js, ensuring speed and reliability with minimal manual intervention.',
      icon: <FaCode />,
    },
    {
      title: 'Continuous Maintenance & Updates',
      description:
        'Our automated systems handle all updates, security patches, and maintenance tasks, keeping your website in top shape effortlessly.',
      icon: <FaSync />,
    },
    {
      title: 'Automated Analytics & Reporting',
      description:
        'Receive monthly automated reports on website performance, user analytics, and SEO, with no extra effort required from your side.',
      icon: <FaChartLine />,
    },
    {
      title: 'Scalable Solutions',
      description:
        'Your website grows with your business, with scalable infrastructure that automatically adapts to increased traffic and demand.',
      icon: <FaExpandArrowsAlt />,
    },
  ];

  const whyChooseUsFeatures = [
    {
      title: 'Hands-Off Management',
      description:
        'With Charlava, everything is automated. From updates to analytics, your website runs smoothly without requiring your constant attention.',
      icon: <FaSync />,
    },
    {
      title: 'Efficient and Scalable',
      description:
        'Our WaaS model ensures that your website can scale with your business needs, handling traffic spikes and growth automatically.',
      icon: <FaExpandArrowsAlt />,
    },
    {
      title: 'Transparent and Predictable Pricing',
      description:
        'Our pricing model is simple and transparent. Pay a monthly fee and get all the benefits of a fully managed, continuously improving website.',
      icon: <FaCode />,
    },
    {
      title: 'Automation-Driven Results',
      description:
        'All our services are designed to deliver consistent, reliable results through automation, ensuring your website remains top-tier without manual input.',
      icon: <FaChartLine />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Charlava - Website as a Service (WaaS)</title>
        <meta
          name="description"
          content="Charlava offers Website as a Service (WaaS) with automated web development, hosting, and ongoing improvements without the hassle of managing it yourself."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar brandName="Charlava" links={navLinks} ctaLabel="Get Started" ctaLink="#get-started" />

      <main className="container mx-auto p-6 flex-grow">
        <HeroSection
          title="Charlava"
          description="Website as a Service (WaaS) - Efficient, Automated, and Hassle-Free"
          primaryCtaLabel="Learn More"
          primaryCtaLink="#what-we-offer"
          secondaryCtaLabel="Contact Us"
          secondaryCtaLink="#get-started"
          imageUrl="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
        />

        <ContentSection
          title="What We Offer"
          description="Charlava provides a fully automated, hands-off approach to managing your website."
          features={whatWeOfferFeatures}
        />

        <ContentSection
          title="Our Approach"
          description="Charlava focuses on providing a streamlined, automated solution for your website needs. Our clients benefit from:"
          features={[
            {
              title: 'Future Service Upgrades',
              description: 'Access to future service upgrades without additional costs.',
              icon: <FaSync />,
            },
            {
              title: 'Automated Performance Checks',
              description: 'Automated performance and security checks with monthly reports.',
              icon: <FaChartLine />,
            },
            {
              title: 'SEO Optimization',
              description: 'SEO optimization with no manual adjustments required.',
              icon: <FaCode />,
            },
            {
              title: 'Hands-Off Experience',
              description: 'A completely hands-off experience—set it and forget it.',
              icon: <FaSync />,
            },
          ]}
        />

        <ContentSection
          title="Why Choose Us?"
          description="Here are some reasons why Charlava is the right choice for your business."
          features={whyChooseUsFeatures}
        />

        <ContactSection
          title="Get Started"
          description="Ready to simplify your online presence? Contact us today to see how our WaaS model can keep your website performing at its best with minimal effort on your part."
          onFormSubmit={(formData) => console.log('Form submitted:', formData)}
          buttonText="Send Message"
          email="info@charlava.com"
          address="123 Main Street\nDurham, NC 27701"
          facebookUrl="https://facebook.com/yourprofile"
          twitterUrl="https://twitter.com/yourprofile"
          instagramUrl="https://instagram.com/yourprofile"
          linkedinUrl="https://linkedin.com/yourprofile"
          githubUrl="https://github.com/yourprofile"
        />
      </main>

      <footer className="bg-gray-900 text-white p-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Charlava. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
