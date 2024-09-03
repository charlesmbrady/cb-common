import MuiImageListItem from '@mui/material/ImageListItem';

export type ImageListItemProps = React.ComponentProps<typeof MuiImageListItem>;

export function ImageListItem(props: ImageListItemProps) {
  return <MuiImageListItem {...props} />;
}

export default ImageListItem;
