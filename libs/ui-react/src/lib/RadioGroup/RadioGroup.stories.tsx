import { Story, Meta } from '@storybook/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { RadioGroup, RadioGroupProps } from './RadioGroup';
import {
  ValidatedRadioGroup,
  ValidatedRadioGroupProps,
} from './ValidatedRadioGroup';
import Button from '../Button/Button';

export default {
  component: RadioGroup,
  title: 'RadioGroup',
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

const StandardTemplate: Story<Partial<RadioGroupProps<number>>> = (args) => {
  const [age, setAge] = useState<number | null>(options[0].value);

  return <RadioGroup value={age} onChange={(age) => setAge(age)} {...args} />;
};

export const Standard = StandardTemplate.bind({});
Standard.args = {
  label: 'Age',
  options,
};

const ValidatedTemplate: Story<
  Partial<ValidatedRadioGroupProps<TestFormData, number>>
> = (args) => {
  const { handleSubmit, control } = useForm<TestFormData>();

  const onSubmit = (data: TestFormData) => console.log('onSubmit', data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ValidatedRadioGroup
        label="Age"
        name="testFieldName"
        control={control}
        {...args}
      />
      <br />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export const Validated = ValidatedTemplate.bind({});
Validated.args = {
  options,
  validation,
};
