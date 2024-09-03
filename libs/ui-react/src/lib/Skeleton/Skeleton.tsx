import MuiSkeleton from '@mui/material/Skeleton';

export type SkeletonProps = React.ComponentProps<typeof MuiSkeleton>;

export function Skeleton(props: SkeletonProps) {
  return <MuiSkeleton {...props} />;
}

export default Skeleton;
