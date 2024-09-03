import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';

import Box from '../Box/Box';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

export type TextFieldProps = MuiTextFieldProps & {
  infoText?: string;
};

export function TextField({
  value,
  fullWidth,
  sx,
  infoText,
  ...rest
}: TextFieldProps) {
  const textField = (
    <MuiTextField
      data-test="text-field"
      fullWidth={fullWidth}
      value={value || ''}
      autoComplete="off"
      {...rest}
      sx={{ width: fullWidth ? undefined : 300, ...sx }}
    />
  );

  return infoText ? (
    <Box display="inline-flex">
      {textField}
      <Box sx={{ pt: 2, pl: 2 }}>
        <InfoTooltip title={infoText} size="medium" placement="right" />
      </Box>
    </Box>
  ) : (
    textField
  );
}

export default TextField;
