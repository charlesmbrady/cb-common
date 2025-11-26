import * as React from 'react';
import { TestimonialsContainer } from './TestimonialsContainer';
import {
  TestimonialsHeader,
  TestimonialsHeaderProps,
} from './TestimonialsHeader';
import { TestimonialsGrid, TestimonialsGridProps } from './TestimonialsGrid';

export type TestimonialsCommonProps = {
  id?: string;
  headerProps?: TestimonialsHeaderProps;
  gridProps?: TestimonialsGridProps;
  showHeader?: boolean;
};

export function TestimonialsCommon({
  id = 'testimonials',
  headerProps,
  gridProps,
  showHeader = true,
}: TestimonialsCommonProps) {
  return (
    <TestimonialsContainer id={id}>
      {showHeader && <TestimonialsHeader {...headerProps} />}
      <TestimonialsGrid {...gridProps} />
    </TestimonialsContainer>
  );
}
