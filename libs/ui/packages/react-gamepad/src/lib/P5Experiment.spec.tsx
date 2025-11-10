import { render } from '@testing-library/react';

import P5Experiment from './P5Experiment';

describe('P5Experiment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<P5Experiment />);
    expect(baseElement).toBeTruthy();
  });
});
