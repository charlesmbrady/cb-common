//Common code for each main page header with title and optional subtitle
import React from 'react';
import { Typography } from '@cb-common/ui-react-mui';

interface PageHeaderProps {
  title: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
      {title}
    </Typography>
  );
};
