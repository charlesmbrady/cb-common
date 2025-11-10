import * as React from 'react';
import { Link } from '../../../../core';
import { FAQItemData } from './FAQItem';

export const defaultFAQItems: FAQItemData[] = [
  {
    id: 'panel1',
    question:
      'How do I contact customer support if I have a question or issue?',
    answer: (
      <>
        You can reach our customer support team by emailing&nbsp;
        <Link href="mailto:support@email.com">support@email.com</Link>
        &nbsp;or calling our toll-free number. We're here to assist you
        promptly.
      </>
    ),
  },
  {
    id: 'panel2',
    question: "Can I return the product if it doesn't meet my expectations?",
    answer:
      "Absolutely! We offer a hassle-free return policy. If you're not completely satisfied, you can return the product within [number of days] days for a full refund or exchange.",
  },
  {
    id: 'panel3',
    question: 'What makes your product stand out from others in the market?',
    answer:
      'Our product distinguishes itself through its adaptability, durability, and innovative features. We prioritize user satisfaction and continually strive to exceed expectations in every aspect.',
  },
  {
    id: 'panel4',
    question: 'Is there a warranty on the product, and what does it cover?',
    answer:
      'Yes, our product comes with a [length of warranty] warranty. It covers defects in materials and workmanship. If you encounter any issues covered by the warranty, please contact our customer support for assistance.',
  },
];
