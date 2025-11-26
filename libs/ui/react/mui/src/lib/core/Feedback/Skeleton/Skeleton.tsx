// ui/mui/core/src/Skeleton.tsx
import { Skeleton as MUISkeleton, SkeletonProps } from '@mui/material';
export const Skeleton = (props: SkeletonProps) => (
  <MUISkeleton data-testid="skeleton" {...props} />
);
