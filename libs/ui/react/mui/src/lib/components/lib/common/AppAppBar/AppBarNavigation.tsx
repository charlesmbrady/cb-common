import * as React from 'react';
import { Button, RouterLink } from '../../../../core';

export type AppBarNavigationItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type AppBarNavigationProps = {
  items?: AppBarNavigationItem[];
  color?: 'info' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
};

const defaultItems: AppBarNavigationItem[] = [
  { label: 'Features' },
  { label: 'Testimonials' },
  { label: 'Highlights' },
  { label: 'Pricing' },
  { label: 'FAQ' },
  { label: 'Blog' },
];

export function AppBarNavigation({
  items = defaultItems,
  color = 'info',
  size = 'small',
}: AppBarNavigationProps) {
  return (
    <>
      {items.map((item, index) => {
        const isInternal = !!item.href && item.href.startsWith('/');
        const baseSx =
          item.label === 'FAQ' || item.label === 'Blog' ? { minWidth: 0 } : {};
        return isInternal ? (
          <Button
            key={index}
            variant="text"
            color={color}
            size={size}
            component={RouterLink as any}
            // MUI Button doesn't declare 'to', but passing it through works at runtime via RouterLink.
            // Cast to any to satisfy TS while keeping minimal change.
            {...({ to: item.href } as any)}
            onClick={item.onClick}
            sx={baseSx}
          >
            {item.label}
          </Button>
        ) : (
          <Button
            key={index}
            variant="text"
            color={color}
            size={size}
            href={item.href}
            onClick={item.onClick}
            sx={baseSx}
          >
            {item.label}
          </Button>
        );
      })}
    </>
  );
}
