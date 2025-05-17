import { render } from '@testing-library/react';

import LeftJoystick from './LeftJoystick';

describe('LeftJoystick', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeftJoystick />);
    expect(baseElement).toBeTruthy();
  });
});
