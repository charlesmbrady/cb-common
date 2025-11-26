import * as React from 'react';
import { Box, Container } from '../../../../core';
import { HighlightsHeader, HighlightsHeaderProps } from './HighlightsHeader';
import { HighlightsGrid, HighlightsGridProps } from './HighlightsGrid';
import { defaultHighlights } from './highlightsData';

export type HighlightsCommonProps = {
  id?: string;
  headerProps?: HighlightsHeaderProps;
  gridProps?: Omit<HighlightsGridProps, 'items'> & {
    items?: HighlightsGridProps['items'];
  };
  backgroundColor?: string;
  textColor?: string;
};

export function HighlightsCommon({
  id = 'highlights',
  headerProps,
  gridProps,
  backgroundColor = 'grey.900',
  textColor = 'white',
}: HighlightsCommonProps) {
  const { items = defaultHighlights, ...restGridProps } = gridProps || {};

  return (
    <Box
      id={id}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: textColor,
        bgcolor: backgroundColor,
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <HighlightsHeader {...headerProps} />
        <HighlightsGrid items={items} {...restGridProps} />
      </Container>
    </Box>
  );
}
