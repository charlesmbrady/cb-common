import MuiSlider from '@mui/material/Slider';

export type SliderProps = React.ComponentProps<typeof MuiSlider>;

export function Slider(props: SliderProps) {
  return <MuiSlider {...props} />;
}

export default Slider;
