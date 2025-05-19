import React from 'react';

const DotMLogo = ({ style = {} }) => (
  <svg
    viewBox="0 0 1200 900"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', width: '100%', height: 'auto', ...style }}
  >
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1976d2" stopOpacity="1" />
        <stop offset="50%" stopColor="#64b5f6" stopOpacity="1" />
        <stop offset="100%" stopColor="#1976d2" stopOpacity="1" />
      </linearGradient>
    </defs>
    <g transform="translate(0,0)">
      <path
        d="M 40 650 L 40 60 L 100 600 L 160 60 L 160 650"
        stroke="url(#gradient1)"
        strokeWidth="22"
        filter="drop-shadow(0 0 32px #6366F1)"
        fill="none"
      />
    </g>
  </svg>
);

export default DotMLogo;
