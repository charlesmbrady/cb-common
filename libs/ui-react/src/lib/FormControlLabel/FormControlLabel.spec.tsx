import { render } from '@testing-library/react';

import Checkbox from '../Checkbox/Checkbox';
import FormControlLabel from './FormControlLabel';

describe('FormControlLabel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FormControlLabel control={<Checkbox />} label="test" />
    );
    expect(baseElement).toBeTruthy();
  });
});
