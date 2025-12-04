import { createElement } from 'react';
import type { ReactNode } from 'react';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';

export type AppListItem = {
  title: string;
  description: string;
  meta: string[];
  badge?: string;
  to?: string;
  href?: string;
  icon?: ReactNode;
};

export const modernApps: AppListItem[] = [
  {
    title: 'AI Assistant Chat',
    description:
      'AWS Bedrock + Agentcore chat with short-term memory, cost-optimized prompts (no streaming tokens) tuned as my personal portfolio assistant so you can ask about my projects or experience.',
    meta: [
      'AWS Bedrock',
      'AWS Agentcore',
      'React',
      'AWS Lambda',
      'DynamoDB',
      'MUI',
      'API Gateway',
      'Serverless',
      'TypeScript',
      'Cloudfront CDN',
      'Terraform',
      'Cognito',
      'S3',
      'Node.js',
      'Express',
    ],
    badge: 'New',
    to: '/aichat',
    icon: createElement(ChatBubbleOutlineRoundedIcon, { fontSize: 'small' }),
  },
  {
    title: 'Google Book Search',
    description:
      'A11y-friendly search that caches favorite reads, exposes REST pagination helpers, and demos optimistic UI.',
    meta: ['React', 'REST APIs'],
    to: '/googlebooksearch',
    icon: createElement(MenuBookRoundedIcon, { fontSize: 'small' }),
  },
];

export const throwbackApps: AppListItem[] = [
  {
    title: 'GifTastic',
    description:
      'Vanilla JS + GIPHY API mash-up with category presets and keyboard navigation.',
    meta: ['Vanilla JS', 'GIPHY API'],
    href: '/subapps/GifTastic/index.html',
  },
  {
    title: 'The Psychic Game',
    description:
      'Guess-the-letter challenge featuring simple state management and audio feedback.',
    meta: ['Audio cues', 'Keyboard first'],
    href: '/subapps/ThePsychicGame/index.html',
  },
  {
    title: 'Trivia Game',
    description:
      'Timer-driven trivia rounds highlighting DOM-first animation techniques.',
    meta: ['Timers', 'Animations'],
    href: '/subapps/TriviaGame/index.html',
  },
  {
    title: 'Word Guess Game',
    description:
      'Classic hangman rebuilt with modular utilities and accessible inputs.',
    meta: ['Accessibility', 'Utilities'],
    href: '/subapps/WordGuessGame/index.html',
  },
  {
    title: 'Star Wars RPG',
    description:
      'Turn-based battle system with dynamic stat tracking and retro sprites.',
    meta: ['Game loops', 'Sprite work'],
    href: '/subapps/StarWarsGame/index.html',
  },
  {
    title: 'Form Validator',
    description:
      'Lightweight validation patterns without dependencies, built for teaching demos.',
    meta: ['Validation', 'No deps'],
    href: '/subapps/FormValidator/index.html',
  },
  {
    title: 'Movie Seat Booking',
    description:
      'LocalStorage-powered seat map to prove data persistence without frameworks.',
    meta: ['LocalStorage', 'State'],
    href: '/subapps/MovieSeatBooking/index.html',
  },
];

export const heroBadge = {
  icon: createElement(SportsEsportsRoundedIcon, { fontSize: 'small' }),
  label: 'Apps & experiments',
};

export const throwbackCtaIcon = createElement(ArrowOutwardRoundedIcon, {
  fontSize: 'small',
});
