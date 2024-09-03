import { render } from '@testing-library/react';

import { AuthDialog } from './AuthDialog';

describe('Auth', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthDialog open={true} />);
    expect(baseElement).toBeTruthy();
  });
});
