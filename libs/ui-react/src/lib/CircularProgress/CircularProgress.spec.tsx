import { render } from '@testing-library/react';

import CircularProgress from './CircularProgress';

describe('CircularProgress', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CircularProgress />);
    expect(baseElement).toBeTruthy();
  });
});
