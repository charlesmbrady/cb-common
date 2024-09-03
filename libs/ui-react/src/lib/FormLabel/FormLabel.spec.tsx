import { render } from '@testing-library/react';

import FormLabel from './FormLabel';

describe('FormLabel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormLabel />);
    expect(baseElement).toBeTruthy();
  });
});
