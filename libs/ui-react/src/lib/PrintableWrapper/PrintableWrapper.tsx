import { forwardRef, ReactNode } from 'react';

export const PrintableWrapper = forwardRef<HTMLDivElement, { children: ReactNode }>((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});
