import MuiTextArea from '@mui/material/TextareaAutosize';

export type TextAreaProps = React.ComponentProps<typeof MuiTextArea>;

export function TextArea(props: TextAreaProps) {
  return <MuiTextArea {...props} />;
}

export default TextArea;
