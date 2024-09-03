import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'; //TODO: DO THIS.might be able to import our other select component here and work off that instead of reimporting from Mui

import { generateTestDataAttr } from '../utilities';
import Box from '../Box/Box';
import Checkbox from '../Checkbox/Checkbox';
import CircularProgress from '../CircularProgress/CircularProgress';
import FormControl from '../FormControl/FormControl';
import FormHelperText from '../FormHelperText/FormHelperText';
import useFormLabelId from '../hooks/useFormLabelId';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import InputLabel from '../InputLabel/InputLabel';
import MenuItem from '../MenuItem/MenuItem';

export type MultiSelectValue = string | number;

export type MultiSelectOptionBase<T extends MultiSelectValue> = {
  label: string;
  value: T;
};

export type MultiSelectOption<T extends MultiSelectValue> =
  | MultiSelectOptionBase<T>
  | Readonly<MultiSelectOptionBase<T>>;

export type MultiSelectOptions<T extends MultiSelectValue> = MultiSelectOption<T>[] | readonly MultiSelectOption<T>[];

export type MultiSelectProps<T extends MultiSelectValue> = Omit<
  MuiSelectProps<T[]>,
  'onChange' | 'value' | 'required'
> & {
  noBlankOption?: boolean;
  options?: MultiSelectOptions<T>;
  infoText?: string;
  isLoading?: boolean;
  onChange?: (value: T[] | null) => void;
  value?: T[] | null;
  helperText?: string;
};

export function MultiSelect<T extends MultiSelectValue>({
  noBlankOption,
  options,
  infoText,
  isLoading,
  onChange,
  value: selectedValues,
  helperText,
  error,
  fullWidth,
  ...muiSelectProps
}: MultiSelectProps<T>) {
  const { id, labelId } = useFormLabelId(muiSelectProps.id, 'select-');

  const select = (
    <FormControl
      sx={{ width: fullWidth ? undefined : 300, mb: 3 }}
      fullWidth={fullWidth}
      error={error}
      // make standard variant if readOnly
      variant={muiSelectProps.readOnly ? 'standard' : muiSelectProps.variant}
    >
      <InputLabel id={labelId}>{muiSelectProps.label}</InputLabel>
      <MuiSelect
        data-test="select"
        labelId={labelId}
        id={id}
        onChange={(e) => {
          if (typeof onChange === 'function') {
            if (typeof e.target.value === 'string') {
              onChange(e.target.value.split(',') as T[]);
            } else {
              onChange(e.target.value);
            }
          }
        }}
        value={selectedValues || []} // FIXME
        error={error}
        {...muiSelectProps}
        // remove dropdown arrow if readOnly
        IconComponent={muiSelectProps.readOnly ? () => null : muiSelectProps.IconComponent}
        multiple
        renderValue={(selected) => {
          // `selected` is either an array of selected option values, or a single option value
          // Convert it to an array if it's not already
          const selectedOptionValues = Array.isArray(selected) ? selected : [selected];
          // Find the option objects corresponding to the selected values
          const selectedOptions = options?.filter((option) => selectedOptionValues.includes(option.value));
          // Return a string of the selected option labels, separated by commas
          return selectedOptions?.map((option) => option.label).join(', ');
        }}
      >
        {!noBlankOption && (
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
        )}
        {Array.isArray(options) &&
          options.map(({ label, value: optionValue }) => {
            const isChecked = selectedValues?.includes(optionValue) || false;
            return (
              <MenuItem key={optionValue} value={optionValue} data-test="select-option">
                <Checkbox checked={isChecked} />
                {label}
              </MenuItem>
            );
          })}
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
    <Box display="inline-flex" sx={{ width: fullWidth ? '100%' : undefined }}>
      {select}
      <Box sx={{ pt: 2, pl: 2 }}>
        <InfoTooltip title={infoText} size="medium" placement="right" />
      </Box>
    </Box>
  ) : (
    select
  );
}

export default MultiSelect;
