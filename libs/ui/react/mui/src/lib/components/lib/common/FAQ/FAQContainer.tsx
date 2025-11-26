import * as React from 'react';
import { Container } from '../../../../core';

export type FAQContainerProps = {
  children: React.ReactNode;
  id?: string;
};

export function FAQContainer({ children, id = 'faq' }: FAQContainerProps) {
  return (
    <Container
      id={id}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      {children}
    </Container>
  );
}
