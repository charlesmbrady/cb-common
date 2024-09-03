import MuiImageList from '@mui/material/ImageList';

export type ImageListProps = React.ComponentProps<typeof MuiImageList>;

export function ImageList(props: ImageListProps) {
  return <MuiImageList {...props} />;
}

export default ImageList;
