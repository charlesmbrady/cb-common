import type { ComponentProps } from 'react';
import { Button, RouterLink } from '@cb-common/ui-react-mui';

export type RouterButtonProps = ComponentProps<typeof Button> & { to: string };

export function RouterButton({ to, ...buttonProps }: RouterButtonProps) {
  return (
    <RouterLink
      to={to}
      style={{ textDecoration: 'none', display: 'inline-flex' }}
    >
      <Button {...buttonProps} />
    </RouterLink>
  );
}
