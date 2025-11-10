// Keep these **semantic** so themes can remap them.
export const colors = {
  primary: { 50: '#F5FAFF', 500: '#2A72FF', 600: '#1F5AE0' },
  surface: { 0: '#0B0F1A', 1: '#111725', 2: '#161D2E' },
  accent: { 500: '#FF7A59' },
  success: { 500: '#31C48D' },
  danger: { 500: '#F05252' },
} as const;

export const radius = { xs: 4, sm: 6, md: 10, lg: 16, xl: 24 } as const;

export const shadow = {
  soft: '0 6px 24px rgba(0,0,0,.16)',
  glass: '0 10px 40px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.08)',
  sharp: '0 1px 0 rgba(255,255,255,.05), 0 2px 8px rgba(0,0,0,.25)',
  neo: 'inset 4px 4px 8px rgba(0,0,0,.35), inset -4px -4px 8px rgba(255,255,255,.08)',
} as const;

export const spacing = (n: number) => `${n * 4}px`;

export const motion = {
  fast: '120ms cubic-bezier(.2,.8,.2,1)',
  normal: '200ms cubic-bezier(.2,.8,.2,1)',
  slow: '320ms cubic-bezier(.2,.8,.2,1)',
} as const;
