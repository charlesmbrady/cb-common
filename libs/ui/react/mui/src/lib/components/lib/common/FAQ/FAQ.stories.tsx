import type { Meta, StoryFn } from '@storybook/react';
import * as React from 'react';
import { FAQCommon } from './FAQCommon';
import { FAQHeader } from './FAQHeader';
import { FAQList } from './FAQList';
import { FAQItem } from './FAQItem';

const meta: Meta<typeof FAQCommon> = {
  component: FAQCommon,
  title: 'Components/Common/FAQ',
};
export default meta;

export const FAQCommonBasic: StoryFn = () => {
  return <FAQCommon />;
};

export const FAQCommonAllowMultiple: StoryFn = () => {
  return (
    <FAQCommon
      listProps={{
        allowMultiple: true,
      }}
    />
  );
};

export const FAQCommonCustomHeader: StoryFn = () => {
  return (
    <FAQCommon
      headerProps={{
        title: 'Help & Support',
        textAlign: 'left',
      }}
    />
  );
};

export const FAQCommonCustomItems: StoryFn = () => {
  const customItems = [
    {
      id: 'custom1',
      question: 'How do I get started?',
      answer: 'Simply sign up for an account and follow our quick start guide.',
    },
    {
      id: 'custom2',
      question: 'Is there a free trial?',
      answer:
        'Yes, we offer a 14-day free trial with full access to all features.',
    },
    {
      id: 'custom3',
      question: 'Can I cancel anytime?',
      answer:
        'Absolutely! You can cancel your subscription at any time with no penalties.',
    },
  ];

  return (
    <FAQCommon
      headerProps={{
        title: 'Getting Started FAQ',
      }}
      listProps={{
        items: customItems,
        allowMultiple: true,
      }}
    />
  );
};

export const FAQHeaderOnly: StoryFn = () => {
  return <FAQHeader title="Custom FAQ Title" />;
};

export const FAQListOnly: StoryFn = () => {
  const items = [
    {
      id: 'test1',
      question: 'Test Question 1',
      answer: 'This is a test answer for the first question.',
    },
    {
      id: 'test2',
      question: 'Test Question 2',
      answer: 'This is a test answer for the second question.',
    },
  ];

  return <FAQList items={items} allowMultiple={true} />;
};

export const FAQItemOnly: StoryFn = () => {
  const [expanded, setExpanded] = React.useState(false);

  const item = {
    id: 'single',
    question: 'Single FAQ Item',
    answer: 'This is a single FAQ item for testing purposes.',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <FAQItem
        item={item}
        expanded={expanded}
        onChange={(_, isExpanded) => setExpanded(isExpanded)}
      />
    </div>
  );
};
