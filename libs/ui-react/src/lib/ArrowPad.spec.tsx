import { render } from '@testing-library/react';

import ArrowPad from './ArrowPad';

describe('ArrowPad', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ArrowPad />);
    expect(baseElement).toBeTruthy();
  });
});
