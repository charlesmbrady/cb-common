import { Control, Controller, ControllerProps, FieldError, FieldValues, Path } from 'react-hook-form';

import { TextField, TextFieldProps } from './TextField';

export type ValidatedTextFieldProps<TFormValues extends FieldValues> = Omit<TextFieldProps, 'value' | 'onChange'> & {
  required?: boolean;
  parseError?: (error: FieldError) => string;
  control: Control<TFormValues>;
  validation?: ControllerProps['rules'];
  name: Path<TFormValues>;
};

export function ValidatedTextField<FormValues extends FieldValues>({
  required,
  parseError,
  control,
  validation = {},
  name,
  ...textFieldProps
}: ValidatedTextFieldProps<FormValues>) {
  if (required && !validation.required) {
    validation.required = 'This field is required';
  }

  return (
    <Controller
      name={name}
      rules={validation}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <TextField
          // value={value as ValueType} // FIXME why is cast this required?
          value={value}
          onChange={onChange}
          error={error && Object.keys(error).length > 0}
          helperText={
            error ? (typeof parseError === 'function' ? parseError(error) : error.message) : textFieldProps.helperText
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variant={textFieldProps.variant as any}
          {...textFieldProps}
        />
      )}
    />
  );
}

export default ValidatedTextField;
