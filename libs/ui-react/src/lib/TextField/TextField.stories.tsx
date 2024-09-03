import { Story, Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { TextField, TextFieldProps } from './TextField';
import {
  ValidatedTextField,
  ValidatedTextFieldProps,
} from './ValidatedTextField';
import Button from '../Button/Button';

export default {
  component: TextField,
  title: 'TextField',
} as Meta;

const validation = {
  required: 'This field is required',
};

type TestFormData = {
  testFieldName: number | null;
};

const StandardTemplate: Story<TextFieldProps> = (args) => (
  <TextField {...args} />
);

export const Standard = StandardTemplate.bind({});
Standard.args = {
  label: 'Label',
  fullWidth: false,
  infoText: '',
};

const ValidatedTemplate: Story<
  Partial<ValidatedTextFieldProps<TestFormData>>
> = (args) => {
  const { handleSubmit, control } = useForm<TestFormData>();

  const onSubmit = (data: TestFormData) => console.log('onSubmit', data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ValidatedTextField
        name="testFieldName"
        control={control}
        fullWidth
        {...args}
      />
      <br />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export const Validated = ValidatedTemplate.bind({});
Validated.args = {
  validation,
  label: 'Label',
  fullWidth: false,
  infoText: '',
};
