import { Typography, useTheme } from '@mui/material';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useMemo } from 'react';

export type DropzoneProps = DropzoneOptions & {
  text?: string;
  activeText?: string;
};

export function Dropzone({
  text = 'Drag and drop files here or click',
  activeText = 'Drop the files here',
  ...dropzoneOptions
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } =
    useDropzone(dropzoneOptions);
  const theme = useTheme();

  const style = useMemo(
    () => ({
      padding: theme.spacing(3),
      color: theme.palette.text.secondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.grey[50],
      borderWidth: 2,
      borderRadius: theme.shape.borderRadius,
      borderColor: theme.palette.grey[200],
      transition: `border ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}`,
      borderStyle: 'dashed',
      outline: 'none',
      ...(isFocused
        ? {
            borderColor: theme.palette.primary.main,
          }
        : {}),
      ...(isDragAccept
        ? {
            borderColor: theme.palette.success.main,
          }
        : {}),
      ...(isDragReject
        ? {
            borderColor: theme.palette.error.main,
          }
        : {}),
    }),
    [isFocused, isDragAccept, isDragReject, theme]
  );

  return (
    <div>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <Typography>{isDragActive ? activeText : text}</Typography>
      </div>
    </div>
  );
}

export default Dropzone;
