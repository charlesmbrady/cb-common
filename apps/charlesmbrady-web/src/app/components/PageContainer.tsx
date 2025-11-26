//Common code for each main page container complete with maxwidth and padding
import React from 'react';
import { Container, Box } from '@cb-common/ui-react-mui';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  paddingY?: number;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  paddingY = 6,
}) => {
  return (
    <Container maxWidth={maxWidth} sx={{ py: paddingY }}>
      {children}
    </Container>
  );
};
