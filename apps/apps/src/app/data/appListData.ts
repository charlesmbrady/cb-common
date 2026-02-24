import { createElement } from 'react';
import type { ReactNode } from 'react';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';

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
  {
    title: 'Self-Driving Car (React)',
    description:
      'React + MUI rebuild of the self-driving car simulation, using a reusable CanvasStage component and the ctx-core engine library.',
    meta: ['React', 'MUI', 'Canvas', 'Neural Network', 'TypeScript'],
    badge: 'New',
    to: '/selfdrivingcar',
    icon: createElement(SportsEsportsRoundedIcon, { fontSize: 'small' }),
  },
  {
    title: '3DPhysicsSandbox',
    description:
      '3D sandbox scene picker with reusable orbit and FPS scenes powered by rapier physics.',
    meta: ['Three.js', 'Rapier', 'React', 'MUI', 'TypeScript'],
    badge: 'New',
    to: '/3dphysicssandbox',
    icon: createElement(ViewInArRoundedIcon, { fontSize: 'small' }),
  },
];

export const throwbackApps: AppListItem[] = [
  {
    title: 'Self Driving Car - No libraries',
    description:
      'A self-driving car simulation built without any external libraries, showcasing fundamental JavaScript and HTML5 canvas techniques.',
    meta: ['machine learning', 'canvas', 'no dependencies'],
    href: '/subapps/SelfDrivingCar/index.html',
  },
  // {
  //   title: 'Self Driving Car - World Editor',
  //   description:
  //     'A graph editor interface for designing custom road layouts and traffic patterns to test the self-driving car AI, built with vanilla JavaScript and HTML5 canvas.',
  //   meta: ['machine learning', 'canvas', 'no dependencies'],
  //   href: '/subapps/SelfDrivingCar/world/index.html',
  // },
  // {
  //   title: 'GifTastic',
  //   description:
  //     'Vanilla JS + GIPHY API mash-up with category presets and keyboard navigation.',
  //   meta: ['Vanilla JS', 'GIPHY API'],
  //   href: '/subapps/GifTastic/index.html',
  // },
  // {
  //   title: 'The Psychic Game',
  //   description:
  //     'Guess-the-letter challenge featuring simple state management and audio feedback.',
  //   meta: ['Audio cues', 'Keyboard first'],
  //   href: '/subapps/ThePsychicGame/index.html',
  // },
  // {
  //   title: 'Trivia Game',
  //   description:
  //     'Timer-driven trivia rounds highlighting DOM-first animation techniques.',
  //   meta: ['Timers', 'Animations'],
  //   href: '/subapps/TriviaGame/index.html',
  // },
  // {
  //   title: 'Word Guess Game',
  //   description:
  //     'Classic hangman rebuilt with modular utilities and accessible inputs.',
  //   meta: ['Accessibility', 'Utilities'],
  //   href: '/subapps/WordGuessGame/index.html',
  // },
  // {
  //   title: 'Star Wars RPG',
  //   description:
  //     'Turn-based battle system with dynamic stat tracking and retro sprites.',
  //   meta: ['Game loops', 'Sprite work'],
  //   href: '/subapps/StarWarsGame/index.html',
  // },
  // {
  //   title: 'Form Validator',
  //   description:
  //     'Lightweight validation patterns without dependencies, built for teaching demos.',
  //   meta: ['Validation', 'No deps'],
  //   href: '/subapps/FormValidator/index.html',
  // },
  // {
  //   title: 'Movie Seat Booking',
  //   description:
  //     'LocalStorage-powered seat map to prove data persistence without frameworks.',
  //   meta: ['LocalStorage', 'State'],
  //   href: '/subapps/MovieSeatBooking/index.html',
  // },
];

export const heroBadge = {
  icon: createElement(SportsEsportsRoundedIcon, { fontSize: 'small' }),
  label: 'Apps & experiments',
};

export const throwbackCtaIcon = createElement(ArrowOutwardRoundedIcon, {
  fontSize: 'small',
});
