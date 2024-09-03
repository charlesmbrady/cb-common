import { render } from '@testing-library/react';

import Snackbar from './Snackbar';

describe('Snackbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Snackbar type="success" message="success message" />);
    expect(baseElement).toBeTruthy();
  });
});
