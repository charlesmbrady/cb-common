import { render } from '@testing-library/react';

import CssBaseline from './CssBaseline';

describe('CssBaseline', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CssBaseline />);
    expect(baseElement).toBeTruthy();
  });
});
