import { render } from '@testing-library/react';

import FormHelperText from './FormHelperText';

describe('FormHelperText', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormHelperText />);
    expect(baseElement).toBeTruthy();
  });
});
