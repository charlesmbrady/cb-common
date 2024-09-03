import MuiRadioGroup, {
  RadioGroupProps as MuiRadioGroupProps,
} from '@mui/material/RadioGroup';
import MuiRadio, { RadioProps as MuiRadioProps } from '@mui/material/Radio';

import Box from '../Box/Box';
import FormControl from '../FormControl/FormControl';
import FormControlLabel, {
  FormControlLabelProps,
} from '../FormControlLabel/FormControlLabel';
import FormLabel from '../FormLabel/FormLabel';
import useFormLabelId from '../hooks/useFormLabelId';
import FormHelperText from '../FormHelperText/FormHelperText';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

export type RadioGroupValue = string | number;

type RadioOptionBase<T extends RadioGroupValue> = {
  label: string;
  value: T;
};

export type RadioOption<T extends RadioGroupValue> =
  | RadioOptionBase<T>
  | Readonly<RadioOptionBase<T>>;

export type RadioOptions<T extends RadioGroupValue> =
  | RadioOption<T>[]
  | readonly RadioOption<T>[];

export type RadioGroupProps<T extends RadioGroupValue> = Omit<
  MuiRadioGroupProps,
  'onChange'
> & {
  onChange?: (value: T) => void;
  options?: RadioOptions<T>;
  label?: React.ReactNode;
  labelPlacement?: FormControlLabelProps['labelPlacement'];
  size?: MuiRadioProps['size'];
  color?: MuiRadioProps['color'];
  error?: boolean;
  helperText?: string;
  infoText?: string;
  disabled?: boolean;
};

export function RadioGroup<T extends RadioGroupValue>({
  onChange,
  options,
  defaultValue,
  label,
  labelPlacement,
  size,
  color,
  helperText,
  error,
  infoText,
  disabled,
  ...radioGroupProps
}: RadioGroupProps<T>) {
  const { labelId, helperTextId } = useFormLabelId(
    radioGroupProps.id,
    'radio-group-'
  );

  const formLabel = (
    <FormLabel id={labelId} sx={{ mr: 2 }}>
      {label}
    </FormLabel>
  );

  return (
    <FormControl sx={{ mb: 3 }}>
      {infoText ? (
        <Box sx={{ alignItems: 'center', display: 'inline-flex' }}>
          {formLabel}
          <InfoTooltip title={infoText} size="medium" placement="right" />
        </Box>
      ) : (
        formLabel
      )}
      <MuiRadioGroup
        onChange={(e) => {
          if (typeof onChange === 'function') {
            onChange(e.target.value as T);
          }
        }}
        aria-labelledby={labelId}
        aria-describedby={helperTextId}
        value={radioGroupProps.value || null}
        {...radioGroupProps}
      >
        {Array.isArray(options) &&
          options.map(({ label, value }) => (
            <FormControlLabel
              key={value}
              data-test="radio-option"
              disabled={disabled}
              value={value}
              control={<MuiRadio size={size} color={color} />}
              label={label}
              labelPlacement={labelPlacement}
            />
          ))}
      </MuiRadioGroup>
      {helperText && (
        <FormHelperText id={helperTextId} error={error}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default RadioGroup;
