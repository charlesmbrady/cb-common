import { render } from '@testing-library/react';

import Step from './Step';

describe('Step', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Step />);
    expect(baseElement).toBeTruthy();
  });
});
