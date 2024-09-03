import { render } from '@testing-library/react';

import StepLabel from './StepLabel';

describe('StepLabel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StepLabel />);
    expect(baseElement).toBeTruthy();
  });
});
