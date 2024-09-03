import { Story, Meta } from '@storybook/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Select, SelectProps } from './Select';
import { ValidatedSelect, ValidatedSelectProps } from './ValidatedSelect';
import Box from '../Box/Box';
import Button from '../Button/Button';

export default {
  component: Select,
  title: 'Select',
} as Meta;

const options = [
  { value: 10, label: 'Ten' },
  { value: 20, label: 'Twenty' },
  { value: 30, label: 'Thirty' },
];

const validation = {
  required: 'This field is required',
};

type TestFormData = {
  testFieldName: number | null;
};

const StandardTemplate: Story<Partial<SelectProps<number>>> = (args) => {
  const [age, setAge] = useState<number | null>(options[0].value);

  return (
    <Box sx={{ width: 300 }}>
      <Select fullWidth value={age} onChange={(age) => setAge(age)} {...args} />
    </Box>
  );
};

export const Standard = StandardTemplate.bind({});
Standard.args = {
  label: 'Age',
  options,
};

const ValidatedTemplate: Story<Partial<ValidatedSelectProps<TestFormData, number>>> = (args) => {
  const { handleSubmit, control } = useForm<TestFormData>();

  const onSubmit = (data: TestFormData) => console.log('onSubmit', data);

  return (
    <Box sx={{ width: 300 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ValidatedSelect label="Age" name="testFieldName" control={control} fullWidth {...args} />
        <br />
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
};

export const Validated = ValidatedTemplate.bind({});
Validated.args = {
  options,
  validation,
};
