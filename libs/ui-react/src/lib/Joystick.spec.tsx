import { render } from '@testing-library/react';

import Joystick from './Joystick';

describe('Joystick', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Joystick />);
    expect(baseElement).toBeTruthy();
  });
});
