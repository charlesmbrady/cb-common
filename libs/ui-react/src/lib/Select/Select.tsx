import CircularProgress from '@mui/material/CircularProgress';
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select';

import { generateTestDataAttr } from '../utilities';
import Box from '../Box/Box';
import FormControl from '../FormControl/FormControl';
import FormHelperText from '../FormHelperText/FormHelperText';
import useFormLabelId from '../hooks/useFormLabelId';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import InputLabel from '../InputLabel/InputLabel';
import MenuItem from '../MenuItem/MenuItem';

export type SelectValue = string | number;

type SelectOptionBase<T extends SelectValue> = {
  label: string;
  value: T;
};

export type SelectOption<T extends SelectValue> = SelectOptionBase<T> | Readonly<SelectOptionBase<T>>;

export type SelectOptions<T extends SelectValue> = SelectOption<T>[] | readonly SelectOption<T>[];

export type SelectProps<T extends SelectValue> = Omit<MuiSelectProps<T>, 'onChange' | 'value' | 'required'> & {
  noBlankOption?: boolean;
  options?: SelectOptions<T>;
  infoText?: string;
  isLoading?: boolean;
  onChange?: (value: T | null) => void;
  value?: T | null;
  helperText?: string;
};

export function Select<T extends SelectValue>({
  noBlankOption,
  options,
  infoText,
  isLoading,
  onChange,
  value,
  helperText,
  error,
  ...muiSelectProps
}: SelectProps<T>) {
  const { id, labelId } = useFormLabelId(muiSelectProps.id, 'select-');

  const select = (
    <FormControl sx={{ width: 300, mb: 3 }} fullWidth={muiSelectProps.fullWidth}>
      <InputLabel id={labelId}>{muiSelectProps.label}</InputLabel>
      <MuiSelect
        data-test="select"
        labelId={labelId}
        id={id}
        onChange={(e) => {
          if (typeof onChange === 'function') {
            if (e.target.value === '') {
              onChange(null);
            } else {
              onChange(e.target.value as T);
            }
          }
        }}
        value={value || ('' as T)} // FIXME
        error={error}
        {...muiSelectProps}
      >
        {!noBlankOption && (
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
        )}
        {Array.isArray(options) &&
          options.map(({ label, value }) => (
            <MenuItem key={value} value={value} data-test="select-option">
              {label}
            </MenuItem>
          ))}
        {isLoading && (
          <MenuItem disabled value="progress">
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <CircularProgress />
            </Box>
          </MenuItem>
        )}
      </MuiSelect>
      {helperText && (
        <FormHelperText data-test={generateTestDataAttr('helper-text', muiSelectProps.label?.toString())} error={error}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );

  return infoText ? (
    <Box display="inline-flex">
      {select}
      <Box sx={{ pt: 2, pl: 2 }}>
        <InfoTooltip title={infoText} size="medium" placement="right" />
      </Box>
    </Box>
  ) : (
    select
  );
}

export default Select;
