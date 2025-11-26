// Select.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { FormControl, FormHelperText, InputLabel } from '../Form';
import { MenuItem } from '../../Navigation/Menu/MenuItem';
import React from 'react';
import { SelectChangeEvent } from '@mui/material';

const meta: Meta<typeof Select> = {
  title: 'Inputs/Select',
  component: Select,
};
export default meta;
type Story = StoryObj<typeof Select>;

export function SelectLabels() {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setAge(event.target.value as string);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>With label + helper text</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Without label</FormHelperText>
      </FormControl>
    </div>
  );
}
