import { render } from '@testing-library/react';

import InputLabel from './InputLabel';

describe('InputLabel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputLabel />);
    expect(baseElement).toBeTruthy();
  });
});
