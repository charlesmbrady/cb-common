import { render } from '@testing-library/react';

import Accordian from './Accordian';

describe('Accordian', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Accordian />);
    expect(baseElement).toBeTruthy();
  });
});
