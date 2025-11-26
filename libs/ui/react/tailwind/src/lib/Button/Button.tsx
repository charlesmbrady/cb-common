import * as React from 'react';
import clsx from 'clsx';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 font-semibold rounded',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary/80',
        variant === 'ghost' && 'bg-transparent text-primary hover:bg-surface-1',
        className
      )}
      {...props}
    />
  );
}
